import { AssignExpr, BinaryExpr, CallExpr, CommaExpr, Expr, ExprVisitor, GroupingExpr, LiteralExpr, LogicalBinaryExpr, PrefixSelfExpr, SuffixSelfExpr, UnaryExpr, VariableExpr } from "../Ast/Expr";
import { BlockStmt, BreakStmt, ContinueStmt, DoWhileStmt, ExpressionStmt, ForStmt, FunctionStmt, IfStmt, LoopStmt, PrintStmt, ReturnStmt, Stmt, StmtVisitor, VarListStmt, VarStmt, WhileStmt } from "../Ast/Stmt";
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
        const fnName = stmt.fn_name.name === "main" ? "main" : stmt.fn_name._id //函数名
        const retType = typeToLLVM(stmt.retType);
        this.printIR(`define ${retType} @${fnName}(${stmt.params.map(p => typeToLLVM(p.type) + ' %' + p.name).join(', ')}) {`)
        this.printIR(`entry:`)
        stmt.body.accept(this);
        this.printIR(`}`)
    }
    // 语句生成
    visitReturnStmt(stmt: ReturnStmt): void {
        const _retType = typeToLLVM(stmt.value?.exprType);
        if (stmt.value) {
            const value = stmt.value.accept(this);
            this.printIR(`ret ${_retType} ${value}`);
        } else {
            this.printIR(`ret void`);
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

    visitLoopStmt(stmt: LoopStmt): void {
        const n = this.sequence++;
        const body_label = `loop${n}_body`
        const end_label = `loop${n}_end`
        this.enclosing.push({
            start: body_label,
            end: end_label
        })
        this.printIR(`br label %${body_label}`);
        this.printIR(`${body_label}:`);
        stmt.body.accept(this);
        this.printIR(`br label %${body_label}`);
        this.printIR(`${end_label}:`);
        this.enclosing.pop()
    }
    visitForStmt(stmt: ForStmt): void {
        const n = this.sequence++;
        const initLabel = `for${n}_init`
        const cond_label = `for${n}_cond`
        const inc_label = `for${n}_inc`
        const body_label = `for${n}_body`
        const end_label = `for${n}_end`
        this.enclosing.push({
            start: inc_label,
            end: end_label
        })
        this.printIR(`br label %${initLabel}`);
        this.printIR(`${initLabel}:`);

        if (stmt.initializer) {
            stmt.initializer.accept(this);
        }

        this.printIR(`br label %${cond_label}`);
        this.printIR(`${cond_label}:`);

        if (stmt.condition) {
            const cond = stmt.condition.accept(this);
            const cond_val = `for${n}_cond_val`
            this.printIR(`%${cond_val} = icmp ne i1 ${cond}, 0`);
            this.printIR(`br i1 %${cond_val}, label %${body_label}, label %${end_label}`);
        } else {
            this.printIR(`br label %${body_label}`);
        }

        this.printIR(`${body_label}:`);
        stmt.body.accept(this);

        this.printIR(`br label %${inc_label}`);
        this.printIR(`${inc_label}:`);

        if (stmt.increment) {
            stmt.increment.accept(this);
        }

        this.printIR(`br label %${cond_label}`);
        this.printIR(`${end_label}:`);

        this.enclosing.pop()
    }

    visitDoWhileStmt(stmt: DoWhileStmt): void {
        const n = this.sequence++;
        const body_label = `do${n}_body`
        const cond_label = `do${n}_cond`
        const end_label = `do${n}_end`

        this.enclosing.push({
            start: cond_label,
            end: end_label
        })

        this.printIR(`br label %${body_label}`);
        this.printIR(`${body_label}:`);

        stmt.body.accept(this);

        this.printIR(`br label %${cond_label}`);
        this.printIR(`${cond_label}:`);

        const cond = stmt.condition.accept(this);
        const cond_val = `do${n}_cond_val`
        this.printIR(`%${cond_val} = icmp ne i1 ${cond}, 0`);
        this.printIR(`br i1 %${cond_val}, label %${body_label}, label %${end_label}`);

        this.printIR(`${end_label}:`);
        this.enclosing.pop()
    }

    visitWhileStmt(stmt: WhileStmt): void {
        const n = this.sequence++;
        //标签名
        const cond_label = `while${n}_cond`
        const body_label = `while${n}_body`
        const end_label = `while${n}_end`

        this.enclosing.push({
            start: cond_label,
            end: end_label
        })

        this.printIR(`br label %${cond_label}`);
        this.printIR(`${cond_label}:`);

        const cond = stmt.condition.accept(this);
        const cond_val = `while${n}_cond_val`
        this.printIR(`%${cond_val} = icmp ne i1 ${cond}, 0`);
        this.printIR(`br i1 %${cond_val}, label %${body_label}, label %${end_label}`);

        this.printIR(`${body_label}:`);
        stmt.body.accept(this);

        this.printIR(`br label %${cond_label}`);
        this.printIR(`${end_label}:`);

        this.enclosing.pop()
    }

    //if 语句生成
    visitIfStmt(stmt: IfStmt): void {
        const n = this.sequence++;
        const cond = stmt.condition.accept(this);
        const cond_val = `if${n}_cond_val`
        const then_label = `if${n}_then`
        const else_label = `if${n}_else`
        const end_label = `if${n}_end`
        this.printIR(`%${cond_val} = icmp ne i1 ${cond}, 0`);

        if (stmt.elseBranch) {
            this.printIR(`br i1 %${cond_val}, label %${then_label}, label %${else_label}`);
            this.printIR(`${then_label}:`);
            stmt.thenBranch.accept(this);
            this.printIR(`br label %${end_label}`);
            this.printIR(`${else_label}:`);
            stmt.elseBranch.accept(this);
            this.printIR(`br label %${end_label}`);
            this.printIR(`${end_label}:`);
        } else {
            this.printIR(`br i1 %${cond_val}, label %${then_label}, label %${end_label}`);
            this.printIR(`${then_label}:`);
            stmt.thenBranch.accept(this);
            this.printIR(`br label %${end_label}`);
            this.printIR(`${end_label}:`);
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
        const var_name = stmt.variable._id
        if (this.globalVars.find(v => v === stmt.variable)) {
            // 全局变量
            const varType = typeToLLVM(stmt.variable.type);


            if (stmt.initializer) {
                const value = stmt.initializer.accept(this);
                this.printIR(`@${var_name} = global ${varType} ${value}`);
            } else {
                this.printIR(`@${var_name} = global ${varType} 0`);
            }
        } else {
            const varType = typeToLLVM(stmt.variable.type);
            // 局部变量
            this.printIR(`%${var_name} = alloca ${varType}`);
            if (stmt.initializer) {
                const value = stmt.initializer.accept(this);
                this.printIR(`store ${varType} ${value}, ${varType}* %${var_name}`);
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
        const logical_val = `logical${n}`

        if (expr.operator.lexeme === '&&') {
            this.printIR(`%${logical_val} = and i1 ${left}, ${right}`);
        } else {
            this.printIR(`%${logical_val} = or i1 ${left}, ${right}`);
        }

        return `%${logical_val}`;
    }
    //赋值表达式生成
    visitAssignExpr(expr: AssignExpr): string {
        const value = expr.value.accept(this);
        const varType = typeToLLVM(expr.variable.type)
        const var_name = expr.variable._id
        if (this.globalVars.find(v => v === expr.variable)) {
            this.printIR(`store ${varType} ${value}, ${varType}* @${var_name}`);
        } else {
            this.printIR(`store ${varType} ${value}, ${varType}* %${var_name}`);
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
        const bin_val = `bin${n}`

        switch (expr.operator.lexeme) {
            case '+':
                this.printIR(`%${bin_val} = add ${leftType} ${left}, ${right}`);
                break;
            case '-':
                this.printIR(`%${bin_val} = sub ${leftType} ${left}, ${right}`);
                break;
            case '*':
                this.printIR(`%${bin_val} = mul ${leftType} ${left}, ${right}`);
                break;
            case '/':
                this.printIR(`%${bin_val} = sdiv ${leftType} ${left}, ${right}`);
                break;
            case '%':
                this.printIR(`%${bin_val} = srem ${leftType} ${left}, ${right}`);
                break;
            case '==':
                this.printIR(`%${bin_val} = icmp eq ${leftType} ${left}, ${right}`);
                break;
            case '!=':
                this.printIR(`%${bin_val} = icmp ne ${leftType} ${left}, ${right}`);
                break;
            case '<':
                this.printIR(`%${bin_val} = icmp slt ${leftType} ${left}, ${right}`);
                break;
            case '<=':
                this.printIR(`%${bin_val} = icmp sle ${leftType} ${left}, ${right}`);
                break;
            case '>':
                this.printIR(`%${bin_val} = icmp sgt ${leftType} ${left}, ${right}`);
                break;
            case '>=':
                this.printIR(`%${bin_val} = icmp sge ${leftType} ${left}, ${right}`);
                break;
        }

        return `%${bin_val}`;
    }

    //一元表达式生成
    visitUnaryExpr(expr: UnaryExpr): string {
        const rightType = typeToLLVM(expr.right.exprType)
        const right = expr.right.accept(this);
        const n = this.sequence++;
        const unary_val = `unary${n}`
        switch (expr.operator.lexeme) {
            case '-':
                this.printIR(`%${unary_val} = sub ${rightType} 0, ${right}`);
                break;
            case '!':
                this.printIR(`%${unary_val} = icmp eq ${rightType} ${right}, 0`);
                break;
        }

        return `%${unary_val}`;
    }

    //前缀自增自减表达式生成
    visitPrefixSelfExpr(expr: PrefixSelfExpr): string {
        const n = this.sequence++;
        const var_ = expr.right as VariableExpr;//变量自身
        let ir_var_name = '' //ir中变量
        const right_value = expr.right.accept(this);
        const rightType = typeToLLVM(expr.right.exprType)
        let new_val = `new${n}`

        if (this.globalVars.find(v => v === var_.variable)) {
            ir_var_name = `@${var_.variable._id}`
            if (expr.operator.lexeme === '++') {
                this.printIR(`%${new_val} = add ${rightType} ${right_value}, 1`);
            } else {
                this.printIR(`%${new_val} = sub ${rightType} ${right_value}, 1`);
            }
        } else {
            ir_var_name = `%${var_.variable._id}`
            if (expr.operator.lexeme === '++') {
                this.printIR(`%${new_val} = add ${rightType} ${right_value}, 1`);
            } else {
                this.printIR(`%${new_val} = sub ${rightType} ${right_value}, 1`);
            }
        }
        this.printIR(`store ${rightType} %${new_val}, ${rightType}* ${ir_var_name}`);

        return `%${new_val}`;
    }

    //后缀自增自减表达式生成
    visitSuffixSelfExpr(expr: SuffixSelfExpr): string {
        const n = this.sequence++;
        const left = expr.left as VariableExpr;
        let ir_var_name = ''
        const left_value = left.accept(this)
        const leftType = typeToLLVM(left.exprType)
        let new_val = `new${n}`

        if (this.globalVars.find(v => v === left.variable)) {
            ir_var_name = `@${left.variable._id}`
            if (expr.operator.lexeme === '++') {
                this.printIR(`%${new_val} = add ${leftType} ${left_value}, 1`);
            } else {
                this.printIR(`%${new_val} = sub ${leftType} ${left_value}, 1`);
            }
        } else {
            ir_var_name = `%${left.variable._id}`
            if (expr.operator.lexeme === '++') {
                this.printIR(`%${new_val} = add ${leftType} ${left_value}, 1`);
            } else {
                this.printIR(`%${new_val} = sub ${leftType} ${left_value}, 1`);
            }
        }
        this.printIR(`store ${leftType} %${new_val}, ${leftType}* ${ir_var_name}`);
        return `${left_value}`;
    }

    visitCallExpr(expr: CallExpr): string {
        const n = this.sequence++;
        const args = expr.args.map(arg => arg.accept(this));
        const callee = expr.callee as VariableExpr;
        const call_name = `call${n}`
        this.printIR(`%${call_name} = call i32 @${callee.variable._id}(${args.map(arg => `i32 ${arg}`).join(', ')})`);
        return `%${call_name}`;
    }

    //变量表达式生成
    visitVariableExpr(expr: VariableExpr): string {
        const var_name = expr.variable._id;
        const varType = typeToLLVM(expr.variable.type);
        const n = this.sequence++;
        const var_name_n = `${var_name}_${n}`
        if (this.globalVars.find(v => v === expr.variable)) {
            this.printIR(`%global_${var_name_n} = load ${varType}, ${varType}* @${var_name}`);
            return `%global_${var_name_n}`;
        } else {
            this.printIR(`%local_${var_name_n} = load ${varType}, ${varType}* %${var_name}`);
            return `%local_${var_name_n}`;
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
        case DataType.Void:
            return "void";
    }
}