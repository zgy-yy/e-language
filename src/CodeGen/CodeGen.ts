import { AssignExpr, BinaryExpr, CallExpr, CommaExpr, Expr, ExprVisitor, GroupingExpr, LiteralExpr, LogicalBinaryExpr, SuffixSelfExpr, UnaryExpr, VariableExpr } from "../Ast/Expr";
import { BlockStmt, BreakStmt, ContinueStmt, DoWhileStmt, ExpressionStmt, ForStmt, FunctionStmt, IfStmt, PrintStmt, ReturnStmt, Stmt, StmtVisitor, VarListStmt, VarStmt, WhileStmt } from "../Ast/Stmt";
import { Var } from "../Parse/Symbol";
import { DataType } from "../Lexer/Token";


type EncloseLoop = {
    start: string, //循环开始标签
    end: string //循环结束标签
}

export class CodeGen implements ExprVisitor<string>, StmtVisitor<void> {
    private globalVars: Var[] = [];
    private globalVarListStmt: VarListStmt[] = []; //全局变量列表
    private globalFunctionStmt: FunctionStmt[] = []; //全局变量
    static codeText: string = "";
    private sequence: number = 0;
    private enclosing: EncloseLoop[] = []
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
        const fnName = stmt.fn_name.name //函数名
        const retType = typeToLLVM(stmt.retType);
        this.printIR(`define ${retType} @${fnName}(${stmt.params.map(p => typeToLLVM(p.type) + ' %' + p.name).join(', ')}) {`)
        this.printIR(`entry:`)
        stmt.body.accept(this);
        this.printIR(`}`)
    }
    // 语句生成
    visitReturnStmt(stmt: ReturnStmt): void {
        //todo 根据函数类型 返回值类型 和 函数返回值类型 不一致 需要处理

        const _retType = typeToLLVM(stmt.value?.exprType);
        if (stmt.value) {
            const value = stmt.value.accept(this);
            this.printIR(`  ret ${_retType} ${value}`);
        } else {
            this.printIR(`  ret ${_retType} 0`);
        }
    }

    visitContinueStmt(stmt: ContinueStmt): void {
        const startLabel = this.enclosing.at(-1)?.start
        this.printIR(`br label %${startLabel}`);
    }

    visitBreakStmt(stmt: BreakStmt): void {
        const endLabel = this.enclosing.at(-1)?.end
        this.printIR(`br label %${endLabel}`);
    }

    visitForStmt(stmt: ForStmt): void {
        const n = this.sequence++;
        const initLabel = `for${n}_init`
        const condLabel = `for${n}_cond`
        const incLabel = `for${n}_inc`
        const bodyLabel = `for${n}_body`
        const endLabel = `for${n}_end`
        this.enclosing.push({
            start: incLabel,
            end: endLabel
        })
        this.printIR(`br label %${initLabel}`);
        this.printIR(`${initLabel}:`);

        if (stmt.initializer) {
            stmt.initializer.accept(this);
        }

        this.printIR(`br label %${condLabel}`);
        this.printIR(`${condLabel}:`);

        if (stmt.condition) {
            const cond = stmt.condition.accept(this);
            this.printIR(`%for${n}_cond_val = icmp ne i1 ${cond}, 0`);
            this.printIR(`br i1 %for${n}_cond_val, label %${bodyLabel}, label %${endLabel}`);
        } else {
            this.printIR(`br label %${bodyLabel}`);
        }

        this.printIR(`${bodyLabel}:`);
        stmt.body.accept(this);

        this.printIR(`br label %${incLabel}`);
        this.printIR(`${incLabel}:`);

        if (stmt.increment) {
            stmt.increment.accept(this);
        }

        this.printIR(`br label %${condLabel}`);
        this.printIR(`${endLabel}:`);

        this.enclosing.pop()
    }

    visitDoWhileStmt(stmt: DoWhileStmt): void {
        const n = this.sequence++;
        const bodyLabel = `do${n}_body`
        const condLabel = `do${n}_cond`
        const endLabel = `do${n}_end`

        this.enclosing.push({
            start: condLabel,
            end: endLabel
        })

        this.printIR(`br label %${bodyLabel}`);
        this.printIR(`${bodyLabel}:`);

        stmt.body.accept(this);

        this.printIR(`br label %${condLabel}`);
        this.printIR(`${condLabel}:`);

        const cond = stmt.condition.accept(this);
        this.printIR(`  %do${n}_cond_val = icmp ne i1 ${cond}, 0`);
        this.printIR(`  br i1 %do${n}_cond_val, label %${bodyLabel}, label %${endLabel}`);

        this.printIR(`${endLabel}:`);
        this.enclosing.pop()
    }

    visitWhileStmt(stmt: WhileStmt): void {
        const n = this.sequence++;
        //标签名
        const condLabel = `while${n}_cond`
        const bodyLabel = `while${n}_body`
        const endLabel = `while${n}_end`

        this.enclosing.push({
            start: condLabel,
            end: endLabel
        })

        this.printIR(`br label %${condLabel}`);
        this.printIR(`${condLabel}:`);

        const cond = stmt.condition.accept(this);
        this.printIR(`%while${n}_cond_val = icmp ne i1 ${cond}, 0`);
        this.printIR(`br i1 %while${n}_cond_val, label %${bodyLabel}, label %${endLabel}`);

        this.printIR(`${bodyLabel}:`);
        stmt.body.accept(this);

        this.printIR(`br label %${condLabel}`);
        this.printIR(`${endLabel}:`);

        this.enclosing.pop()
    }

    //if 语句生成
    visitIfStmt(stmt: IfStmt): void {
        const n = this.sequence++;
        const cond = stmt.condition.accept(this);
        this.printIR(`%if${n}_cond = icmp ne i1 ${cond}, 0`);

        if (stmt.elseBranch) {
            this.printIR(`br i1 %if${n}_cond, label %if${n}_then, label %if${n}_else`);
            this.printIR(`if${n}_then:`);
            stmt.thenBranch.accept(this);
            this.printIR(`br label %if${n}_end`);
            this.printIR(`if${n}_else:`);
            stmt.elseBranch.accept(this);
            this.printIR(`br label %if${n}_end`);
            this.printIR(`if${n}_end:`);
        } else {
            this.printIR(`br i1 %if${n}_cond, label %if${n}_then, label %if${n}_end`);
            this.printIR(`if${n}_then:`);
            stmt.thenBranch.accept(this);
            this.printIR(`br label %if${n}_end`);
            this.printIR(`if${n}_end:`);
        }
    }

    //块语句生成
    visitBlockStmt(stmt: BlockStmt): void {
        for (const s of stmt.statements) {
            s.accept(this);
        }
    }

    //表达式语句生成
    visitExpressionStmt(stmt: ExpressionStmt): void {
        stmt.expression.accept(this);
    }

    visitPrintStmt(stmt: PrintStmt): void {
        const _type = typeToLLVM(stmt.expression.exprType);
        const value = stmt.expression.accept(this);
        this.printIR(`%print${this.sequence++} = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), ${_type} ${value})`);
    }

    visitVarStmt(stmt: VarStmt): void {
        if (this.globalVars.find(v => v === stmt.variable)) {
            // 全局变量
            const varType = typeToLLVM(stmt.variable.type);

            if (stmt.initializer) {
                const value = stmt.initializer.accept(this);
                this.printIR(`@${stmt.variable.name} = global ${varType} ${value}`);
            } else {
                this.printIR(`@${stmt.variable.name} = global ${varType} 0`);
            }
        } else {
            const varType = typeToLLVM(stmt.variable.type);
            // 局部变量
            this.printIR(`%${stmt.variable.name} = alloca ${varType}`);
            if (stmt.initializer) {
                const value = stmt.initializer.accept(this);
                this.printIR(`store ${varType} ${value}, ${varType}* %${stmt.variable.name}`);
            }
        }
    }

    visitVarListStmt(stmt: VarListStmt): void {
        for (const v of stmt.varStmts) {
            this.visitVarStmt(v);
        }
    }

    // 逻辑表达式生成
    visitLogicalBinaryExpr(expr: LogicalBinaryExpr): string {
        const left = expr.left.accept(this);
        const right = expr.right.accept(this);
        const n = this.sequence++;

        if (expr.operator.lexeme === '&&') {
            this.printIR(`%logical${n} = and i1 ${left}, ${right}`);
        } else {
            this.printIR(`%logical${n} = or i1 ${left}, ${right}`);
        }

        return `%logical${n}`;
    }
    //赋值表达式生成
    visitAssignExpr(expr: AssignExpr): string {
        const value = expr.value.accept(this);
        const varType = typeToLLVM(expr.variable.type)
        if (this.globalVars.find(v => v === expr.variable)) {
            this.printIR(`  store ${varType} ${value}, ${varType}* @${expr.variable.name}`);
        } else {
            this.printIR(`  store ${varType} ${value}, ${varType}* %${expr.variable.name}`);
        }
        return value;
    }

    //逗号表达式生成
    visitCommaExpr(expr: CommaExpr): string {
        expr.left.accept(this);
        return expr.right.accept(this);
    }

    //二元表达式生成
    visitBinaryExpr(expr: BinaryExpr): string {
        const n = this.sequence++;
        const left = expr.left.accept(this);
        const right = expr.right.accept(this);

        const leftType = typeToLLVM(expr.left.exprType)
        const rightType = typeToLLVM(expr.right.exprType)

        switch (expr.operator.lexeme) {
            case '+':
                this.printIR(`%bin${n} = add ${leftType} ${left}, ${right}`);
                break;
            case '-':
                this.printIR(`%bin${n} = sub ${leftType} ${left}, ${right}`);
                break;
            case '*':
                this.printIR(`%bin${n} = mul ${leftType} ${left}, ${right}`);
                break;
            case '/':
                this.printIR(`%bin${n} = sdiv ${leftType} ${left}, ${right}`);
                break;
            case '%':
                this.printIR(`%bin${n} = srem ${leftType} ${left}, ${right}`);
                break;
            case '==':
                this.printIR(`%bin${n} = icmp eq ${leftType} ${left}, ${right}`);
                break;
            case '!=':
                this.printIR(`%bin${n} = icmp ne ${leftType} ${left}, ${right}`);
                break;
            case '<':
                this.printIR(`%bin${n} = icmp slt ${leftType} ${left}, ${right}`);
                break;
            case '<=':
                this.printIR(`%bin${n} = icmp sle ${leftType} ${left}, ${right}`);
                break;
            case '>':
                this.printIR(`%bin${n} = icmp sgt ${leftType} ${left}, ${right}`);
                break;
            case '>=':
                this.printIR(`%bin${n} = icmp sge ${leftType} ${left}, ${right}`);
                break;
        }

        return `%bin${n}`;
    }

    //一元表达式生成
    visitUnaryExpr(expr: UnaryExpr): string {
        const rightType = typeToLLVM(expr.right.exprType)
        const right = expr.right.accept(this);
        const n = this.sequence++;

        switch (expr.operator.lexeme) {
            case '-':
                this.printIR(`%unary${n} = sub ${rightType} 0, ${right}`);
                break;
            case '!':
                this.printIR(`%unary${n} = icmp eq ${rightType} ${right}, 0`);
                break;
        }

        return `%unary${n}`;
    }

    //后缀自增自减表达式生成
    visitSuffixSelfExpr(expr: SuffixSelfExpr): string {
        const n = this.sequence++;
        const left = expr.left as VariableExpr;
        if (this.globalVars.find(v => v === left.variable)) {
            this.printIR(`%old${n} = load i32, i32* @${left.variable.name}`);
            if (expr.operator.lexeme === '++') {
                this.printIR(`%new${n} = add i32 %old${n}, 1`);
            } else {
                this.printIR(`%new${n} = sub i32 %old${n}, 1`);
            }
            this.printIR(`%store i32 %new${n}, i32* @${left.variable.name}`);
        } else {
            this.printIR(`%old${n} = load i32, i32* %${left.variable.name}`);
            if (expr.operator.lexeme === '++') {
                this.printIR(`%new${n} = add i32 %old${n}, 1`);
            } else {
                this.printIR(`%new${n} = sub i32 %old${n}, 1`);
            }
            this.printIR(`store i32 %new${n}, i32* %${left.variable.name}`);
        }
        return `%old${n}`;
    }

    visitCallExpr(expr: CallExpr): string {
        const n = this.sequence++;
        const args = expr.args.map(arg => arg.accept(this));
        const callee = expr.callee as VariableExpr;
        this.printIR(`%call${n} = call i32 @${callee.variable.name}(${args.map(arg => `i32 ${arg}`).join(', ')})`);
        return `%call${n}`;
    }

    //变量表达式生成
    visitVariableExpr(expr: VariableExpr): string {
        let varName = expr.variable.name;
        let varType = typeToLLVM(expr.variable.type);
        let n = this.sequence++;
        if (this.globalVars.find(v => v === expr.variable)) {
            this.printIR(`%global_${varName}_${n} = load ${varType}, ${varType}* @${varName}`);
            return `%global_${varName}_${n}`;
        } else {
            this.printIR(`%local_${varName}_${n} = load ${varType}, ${varType}* %${varName}`);
            return `%local_${varName}_${n}`;
        }
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



function typeToLLVM(type: DataType): string {
    switch (type) {
        case DataType.Int:
            return "i32";
        case DataType.Boolean:
            return "i1";
    }
}