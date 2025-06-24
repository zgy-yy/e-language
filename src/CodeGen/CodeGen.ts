import { AssignExpr, BinaryExpr, CallExpr, CommaExpr, Expr, ExprVisitor, GroupingExpr, LiteralExpr, LogicalBinaryExpr, SuffixSelfExpr, UnaryExpr, VariableExpr } from "../Ast/Expr";
import { BlockStmt, BreakStmt, ContinueStmt, DoWhileStmt, ExpressionStmt, ForStmt, FunctionStmt, IfStmt, PrintStmt, ReturnStmt, Stmt, StmtVisitor, VarListStmt, VarStmt, WhileStmt } from "../Ast/Stmt";
import { Var } from "../Parse/Symbol";
import { VarType } from "../Lexer/Token";

export class CodeGen implements ExprVisitor<string>, StmtVisitor<void> {
    private globalVars: Var[] = [];
    private globalVarListStmt: VarListStmt[] = []; //全局变量列表
    private globalFunctionStmt: FunctionStmt[] = []; //全局变量
    static codeText: string = "";
    private sequence: number = 0;
    private paramVars: Map<string, number> = new Map();
    private functionDeclarations: string[] = []; //函数声明
    private functionDefinitions: string[] = []; //函数定义

    constructor() {
        // 初始化 LLVM IR 头部
        CodeGen.codeText = `; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"
@format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\\0A\\00"
; 声明 printf 函数
declare i32 @printf(i8*, ...)

`;
    }

    generateCode(programAst: {
        stmt: Stmt[];
    }): string {
        const { stmt } = programAst
        stmt.forEach(stmt => {
            if (stmt instanceof VarListStmt) {
                this.globalVarListStmt.push(stmt)
                this.globalVars.push(...stmt.varStmts.map(v => v.variable))
            }
            if (stmt instanceof FunctionStmt) {
                this.globalFunctionStmt.push(stmt);
            }
        });
        this.globalVarListStmt.forEach(stmt => {
            this.visitVarListStmt(stmt)
        })
        this.globalFunctionStmt.forEach(stmt => {
            this.visitFunctionStmt(stmt)
        })

        console.log('CodeGen.codeText', CodeGen.codeText);
        return CodeGen.codeText;
    }

    visitFunctionStmt(stmt: FunctionStmt): void {
        const fnName = stmt.fn_name.name
        this.printIR(`define i32 @${fnName}(${stmt.params.map(p => 'i32 %' + p.name).join(', ')}) {`)
        this.printIR(`entry:`)
        stmt.body.accept(this);
        this.printIR(`}`)
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
        this.printIR(`  %print${this.sequence++} = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 ${value})`);
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
            if (stmt.initializer) {
                const value = stmt.initializer.accept(this);
                this.printIR(`%${stmt.variable.name} = ${value}`);
            } else {
                this.printIR(`%${stmt.variable.name} = 0`);
            }
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
        let code = ''

        switch (expr.operator.lexeme) {
            case '+':
                code = `add i32 ${left}, ${right}`
                break;
            case '-':
                code = `sub i32 ${left}, ${right}`
                break;
            case '*':
                code = `mul i32 ${left}, ${right}`
                break;
            case '/':
                code = `sdiv i32 ${left}, ${right}`
                break;
            case '%':
                code = `srem i32 ${left}, ${right}`
                break;
            case '==':
                code = `icmp eq i32 ${left}, ${right}`
                break;
            case '!=':
                code = `icmp ne i32 ${left}, ${right}`
                break;
            case '<':
                code = `icmp slt i32 ${left}, ${right}`
                break;
            case '<=':
                code = `icmp sle i32 ${left}, ${right}`
                break;
            case '>':
                code = `icmp sgt i32 ${left}, ${right}`
                break;
            case '>=':
                code = `icmp sge i32 ${left}, ${right}`
                break;
        }

        return code;
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
        let code = ''
        if (this.globalVars.find(v => v === expr.variable)) {
            code = `@${expr.variable.name}`
        } else {
            code = `%${expr.variable.name}`
        }
        return code;
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

