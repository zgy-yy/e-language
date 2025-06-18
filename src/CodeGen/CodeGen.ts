import { AssignExpr, BinaryExpr, CallExpr, CommaExpr, Expr, ExprVisitor, GroupingExpr, LiteralExpr, LogicalBinaryExpr, SuffixSelfExpr, UnaryExpr, VariableExpr } from "../Ast/Expr";
import { BlockStmt, BreakStmt, ContinueStmt, DoWhileStmt, ExpressionStmt, ForStmt, FunctionStmt, IfStmt, PrintStmt, ReturnStmt, Stmt, StmtVisitor, VarListStmt, VarStmt, WhileStmt } from "../Ast/Stmt";
import { Var } from "../Parse/Symbol";
import { VarType } from "../Lexer/Token";

export class CodeGen implements ExprVisitor<string>, StmtVisitor<void> {
    private globalVars: Var[] = [];
    private globalVarStmt: VarStmt[] = [];
    static codeText: string = "";
    private sequence: number = 0;
    private currentFunction: string = "";
    private localVars: Map<string, number> = new Map();
    private paramVars: Map<string, number> = new Map();
    private functionDeclarations: string[] = [];
    private functionDefinitions: string[] = [];

    constructor() {
        // 初始化 LLVM IR 头部
        CodeGen.codeText = `; ModuleID = 'e-language'
source_filename = "e-language"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-pc-linux-gnu"

@format = private unnamed_addr constant [4 x i8] c"%d\\0A\\00"

declare i32 @printf(i8*, ...)
`;
    }

    generateCode(programAst: {
        globalVars: Var[];
        stmt: Stmt[];
    }): string {
        this.globalVars = programAst.globalVars;
        programAst.stmt.forEach(stmt => {
            if (stmt instanceof VarStmt) {
                this.globalVarStmt.push(stmt)
            }
        });

        // 首先生成所有函数的声明
        for (const stmt of programAst.stmt) {
            if (stmt instanceof FunctionStmt) {
                const params = stmt.params.map((_, i) => 'i32').join(', ');
                this.functionDeclarations.push(`declare i32 @${stmt.fn_name.name}(${params})`);
            }
        }

        // 添加所有函数声明到代码中
        for (const decl of this.functionDeclarations) {
            this.printIR(decl);
        }

        // 生成全局变量
        for (const stmt of this.globalVarStmt) {
            this.visitVarStmt(stmt);
        }

        // 收集所有函数定义
        for (const stmt of programAst.stmt) {
            if (stmt instanceof FunctionStmt) {
                this.collectFunctionDefinition(stmt);
            }
        }

        // 添加所有函数定义到代码中
        for (const def of this.functionDefinitions) {
            this.printIR(def);
        }

        console.log('CodeGen.codeText', CodeGen.codeText);
        return CodeGen.codeText;
    }

    private collectFunctionDefinition(stmt: FunctionStmt): void {
        const tempCodeText = CodeGen.codeText;
        CodeGen.codeText = "";

        this.currentFunction = stmt.fn_name.name;
        this.localVars.clear();
        this.paramVars.clear();

        // 生成函数定义
        const params = stmt.params.map((_, i) => 'i32').join(', ');
        this.printIR(`define i32 @${stmt.fn_name.name}(${params}) {`);
        this.printIR(`entry:`);

        // 保存参数到局部变量
        stmt.params.forEach((param, index) => {
            this.paramVars.set(param.name, index);
            this.printIR(`  %${param.name} = alloca i32`);
            this.printIR(`  store i32 %${index}, i32* %${param.name}`);
        });

        // 生成函数体
        stmt.body.accept(this);

        // 如果没有显式的返回语句，添加默认返回
        if (!CodeGen.codeText.includes(`ret i32`)) {
            this.printIR(`  ret i32 0`);
        }

        this.printIR(`}`);

        // 保存函数定义
        this.functionDefinitions.push(CodeGen.codeText);
        
        // 恢复原来的代码
        CodeGen.codeText = tempCodeText;
        this.currentFunction = "";
    }

    visitFunctionStmt(stmt: FunctionStmt): void {
        // 函数定义已经在 collectFunctionDefinition 中处理
        // 这里只需要处理函数体
        stmt.body.accept(this);
    }

    // 语句生成
    visitReturnStmt(stmt: ReturnStmt): void {
        if (stmt.value) {
            const value = stmt.value.accept(this);
            this.printIR(`  ret i32 ${value}`);
        } else {
            this.printIR(`  ret i32 0`);
        }
    }

    visitContinueStmt(stmt: ContinueStmt): void {
        this.printIR(`  br label %continue`);
    }

    visitBreakStmt(stmt: BreakStmt): void {
        this.printIR(`  br label %break`);
    }

    visitForStmt(stmt: ForStmt): void {
        const n = this.sequence++;
        this.printIR(`  br label %for${n}_init`);
        this.printIR(`for${n}_init:`);
        
        if (stmt.initializer) {
            stmt.initializer.accept(this);
        }
        
        this.printIR(`  br label %for${n}_cond`);
        this.printIR(`for${n}_cond:`);
        
        if (stmt.condition) {
            const cond = stmt.condition.accept(this);
            this.printIR(`  %for${n}_cond_val = icmp ne i32 ${cond}, 0`);
            this.printIR(`  br i1 %for${n}_cond_val, label %for${n}_body, label %for${n}_end`);
        } else {
            this.printIR(`  br label %for${n}_body`);
        }
        
        this.printIR(`for${n}_body:`);
        stmt.body.accept(this);
        
        this.printIR(`  br label %for${n}_inc`);
        this.printIR(`for${n}_inc:`);
        
        if (stmt.increment) {
            stmt.increment.accept(this);
        }
        
        this.printIR(`  br label %for${n}_cond`);
        this.printIR(`for${n}_end:`);
    }

    visitDoWhileStmt(stmt: DoWhileStmt): void {
        const n = this.sequence++;
        this.printIR(`  br label %do${n}_body`);
        this.printIR(`do${n}_body:`);
        
        stmt.body.accept(this);
        
        this.printIR(`  br label %do${n}_cond`);
        this.printIR(`do${n}_cond:`);
        
        const cond = stmt.condition.accept(this);
        this.printIR(`  %do${n}_cond_val = icmp ne i32 ${cond}, 0`);
        this.printIR(`  br i1 %do${n}_cond_val, label %do${n}_body, label %do${n}_end`);
        
        this.printIR(`do${n}_end:`);
    }

    visitWhileStmt(stmt: WhileStmt): void {
        const n = this.sequence++;
        this.printIR(`  br label %while${n}_cond`);
        this.printIR(`while${n}_cond:`);
        
        const cond = stmt.condition.accept(this);
        this.printIR(`  %while${n}_cond_val = icmp ne i32 ${cond}, 0`);
        this.printIR(`  br i1 %while${n}_cond_val, label %while${n}_body, label %while${n}_end`);
        
        this.printIR(`while${n}_body:`);
        stmt.body.accept(this);
        
        this.printIR(`  br label %while${n}_cond`);
        this.printIR(`while${n}_end:`);
    }

    visitIfStmt(stmt: IfStmt): void {
        const n = this.sequence++;
        const cond = stmt.condition.accept(this);
        this.printIR(`  %if${n}_cond = icmp ne i32 ${cond}, 0`);
        
        if (stmt.elseBranch) {
            this.printIR(`  br i1 %if${n}_cond, label %if${n}_then, label %if${n}_else`);
            this.printIR(`if${n}_then:`);
            stmt.thenBranch.accept(this);
            this.printIR(`  br label %if${n}_end`);
            this.printIR(`if${n}_else:`);
            stmt.elseBranch.accept(this);
            this.printIR(`  br label %if${n}_end`);
            this.printIR(`if${n}_end:`);
        } else {
            this.printIR(`  br i1 %if${n}_cond, label %if${n}_then, label %if${n}_end`);
            this.printIR(`if${n}_then:`);
            stmt.thenBranch.accept(this);
            this.printIR(`  br label %if${n}_end`);
            this.printIR(`if${n}_end:`);
        }
    }

    visitBlockStmt(stmt: BlockStmt): void {
        for (const s of stmt.statements) {
            s.accept(this);
        }
    }

    visitExpressionStmt(stmt: ExpressionStmt): void {
        stmt.expression.accept(this);
    }

    visitPrintStmt(stmt: PrintStmt): void {
        const value = stmt.expression.accept(this);
        this.printIR(`  %print${this.sequence++} = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @format, i32 0, i32 0), i32 ${value})`);
    }

    visitVarStmt(stmt: VarStmt): void {
        if (this.globalVars.find(v => v === stmt.variable)) {
            // 全局变量
            if (stmt.initializer) {
                const value = stmt.initializer.accept(this);
                this.printIR(`@${stmt.variable.name} = global i32 ${value}`);
            } else {
                this.printIR(`@${stmt.variable.name} = global i32 0`);
            }
        } else {
            // 局部变量
            this.printIR(`  %${stmt.variable.name} = alloca i32`);
            if (stmt.initializer) {
                const value = stmt.initializer.accept(this);
                this.printIR(`  store i32 ${value}, i32* %${stmt.variable.name}`);
            }
            this.localVars.set(stmt.variable.name, this.sequence++);
        }
    }

    visitVarListStmt(stmt: VarListStmt): void {
        for (const v of stmt.varStmts) {
            this.visitVarStmt(v);
        }
    }

    // 表达式生成
    visitLogicalBinaryExpr(expr: LogicalBinaryExpr): string {
        const left = expr.left.accept(this);
        const right = expr.right.accept(this);
        const n = this.sequence++;

        if (expr.operator.lexeme === '&&') {
            this.printIR(`  %logical${n} = and i32 ${left}, ${right}`);
        } else {
            this.printIR(`  %logical${n} = or i32 ${left}, ${right}`);
        }

        return `%logical${n}`;
    }

    visitAssignExpr(expr: AssignExpr): string {
        const value = expr.value.accept(this);
        if (this.globalVars.find(v => v === expr.variable)) {
            this.printIR(`  store i32 ${value}, i32* @${expr.variable.name}`);
        } else {
            this.printIR(`  store i32 ${value}, i32* %${expr.variable.name}`);
        }
        return value;
    }

    visitCommaExpr(expr: CommaExpr): string {
        expr.left.accept(this);
        return expr.right.accept(this);
    }

    visitBinaryExpr(expr: BinaryExpr): string {
        const left = expr.left.accept(this);
        const right = expr.right.accept(this);
        const n = this.sequence++;

        switch (expr.operator.lexeme) {
            case '+':
                this.printIR(`  %bin${n} = add i32 ${left}, ${right}`);
                break;
            case '-':
                this.printIR(`  %bin${n} = sub i32 ${left}, ${right}`);
                break;
            case '*':
                this.printIR(`  %bin${n} = mul i32 ${left}, ${right}`);
                break;
            case '/':
                this.printIR(`  %bin${n} = sdiv i32 ${left}, ${right}`);
                break;
            case '%':
                this.printIR(`  %bin${n} = srem i32 ${left}, ${right}`);
                break;
            case '==':
                this.printIR(`  %bin${n} = icmp eq i32 ${left}, ${right}`);
                break;
            case '!=':
                this.printIR(`  %bin${n} = icmp ne i32 ${left}, ${right}`);
                break;
            case '<':
                this.printIR(`  %bin${n} = icmp slt i32 ${left}, ${right}`);
                break;
            case '<=':
                this.printIR(`  %bin${n} = icmp sle i32 ${left}, ${right}`);
                break;
            case '>':
                this.printIR(`  %bin${n} = icmp sgt i32 ${left}, ${right}`);
                break;
            case '>=':
                this.printIR(`  %bin${n} = icmp sge i32 ${left}, ${right}`);
                break;
        }

        return `%bin${n}`;
    }

    visitUnaryExpr(expr: UnaryExpr): string {
        const right = expr.right.accept(this);
        const n = this.sequence++;

        switch (expr.operator.lexeme) {
            case '-':
                this.printIR(`  %unary${n} = sub i32 0, ${right}`);
                break;
            case '!':
                this.printIR(`  %unary${n} = icmp eq i32 ${right}, 0`);
                break;
        }

        return `%unary${n}`;
    }

    visitSuffixSelfExpr(expr: SuffixSelfExpr): string {
        const n = this.sequence++;
        const left = expr.left as VariableExpr;
        if (this.globalVars.find(v => v === left.variable)) {
            this.printIR(`  %old${n} = load i32, i32* @${left.variable.name}`);
            if (expr.operator.lexeme === '++') {
                this.printIR(`  %new${n} = add i32 %old${n}, 1`);
            } else {
                this.printIR(`  %new${n} = sub i32 %old${n}, 1`);
            }
            this.printIR(`  store i32 %new${n}, i32* @${left.variable.name}`);
        } else {
            this.printIR(`  %old${n} = load i32, i32* %${left.variable.name}`);
            if (expr.operator.lexeme === '++') {
                this.printIR(`  %new${n} = add i32 %old${n}, 1`);
            } else {
                this.printIR(`  %new${n} = sub i32 %old${n}, 1`);
            }
            this.printIR(`  store i32 %new${n}, i32* %${left.variable.name}`);
        }
        return `%old${n}`;
    }

    visitCallExpr(expr: CallExpr): string {
        const n = this.sequence++;
        const args = expr.args.map(arg => arg.accept(this));
        const callee = expr.callee as VariableExpr;
        this.printIR(`  %call${n} = call i32 @${callee.variable.name}(${args.map(arg => `i32 ${arg}`).join(', ')})`);
        return `%call${n}`;
    }

    visitVariableExpr(expr: VariableExpr): string {
        const n = this.sequence++;
        if (this.globalVars.find(v => v === expr.variable)) {
            this.printIR(`  %var${n} = load i32, i32* @${expr.variable.name}`);
        } else {
            this.printIR(`  %var${n} = load i32, i32* %${expr.variable.name}`);
        }
        return `%var${n}`;
    }

    visitLiteralExpr(expr: LiteralExpr): string {
        return expr.value.toString();
    }

    visitGroupingExpr(expr: GroupingExpr): string {
        return expr.expression.accept(this);
    }

    private printIR(code: string): void {
        CodeGen.codeText += code + '\n';
    }
}

