import { ArrayExpr, ArrowExpr, AssignExpr, BinaryExpr, CallExpr, CommaExpr, Expr, ExprVisitor, FunctionExpr, GetFieldExpr, GroupingExpr, IndexExpr, InitializerExpr, LiteralExpr, LogicalBinaryExpr, PrefixSelfExpr, SetFieldExpr, SetIndexExpr, StructExpr, SuffixSelfExpr, UnaryExpr, VariableExpr } from "../Ast/Expr";
import { BlockStmt, BreakStmt, ContinueStmt, DoWhileStmt, ExpressionStmt, ForStmt, FunctionStmt, IfStmt, LoopStmt, PrintStmt, ReturnStmt, Stmt, StmtVisitor, StructStmt, VarListStmt, VarStmt, WhileStmt } from "../Ast/Stmt";
import { ArrayVar, FuncVar, FunLable, Var } from "../Parse/Symbol";
import { ArrayType, DataType, FunType, PtrType, SimpleKind, SimpleType, StructType } from "../Parse/TypeDeclar";
import { Scope } from "./Scope";

type ExprResult = {
    type: string,
    valReg: string
}

type EncloseLoop = {
    start: string, //循环开始标签
    end: string //循环结束标签
}


class LLVMIRCode {
    decle: string[]//声明
    currentFunc: number = -1
    funcIr: {//函数ir指令
        ir: string[]
    }[] = []
    constructor() {
        this.decle = []
        this.funcIr = []
    }
    enterFunc() {
        this.funcIr.push({ ir: [] })
        this.currentFunc++
    }
    leaveFunc() {
        this.currentFunc--
    }
    addDecle(decle: string) {
        this.decle.push(decle)
    }
    addFuncIr(ir: string) {
        this.funcIr.at(this.currentFunc).ir.push(ir)
    }
}

export class CodeGen implements ExprVisitor<ExprResult>, StmtVisitor<void> {
    static codeText: LLVMIRCode = new LLVMIRCode()
    private scope: Scope = new Scope(); // 作用域 index 0为全局作用域
    private enclosing: EncloseLoop[] = []
    private sequence: {
        loop: number,
        for: number,
        doWhile: number,
        while: number,
        if: number,
        block: number,
        reg: number,
    } = { loop: 0, for: 0, doWhile: 0, while: 0, if: 0, block: 0, reg: 0 }
    private functionDeclarations: string[] = []; //函数声明

    constructor() {
        // 初始化 LLVM IR 头部
        CodeGen.codeText.decle.push(`; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"
@format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\\0A\\00"
; 声明 printf 函数
declare i32 @printf(i8*, ...)

`);
    }



    generateCode(programAst: {
        stmt: Stmt[];
    }): string {
        const { stmt } = programAst
        stmt.forEach(stmt => {
            stmt.accept(this);
        });
        const codeText = CodeGen.codeText.decle.join('\n') + '\n' + CodeGen.codeText.funcIr.map(f => f.ir.join('\n')).join('\n')
        console.log('CodeGen.codeText:\n', codeText);
        return codeText;
    }


    visitStructStmt(stmt: StructStmt): void {
        const lv_structName = this.scope.addDeclare(stmt.struct, stmt.struct.name)
        this.printDecle(`%${lv_structName} = type { ${stmt.struct.fields.map((f) => this.typeToLLVM(f.type)).join(', ')} }`);
    }

    visitFunctionStmt(stmt: FunctionStmt): void {
        CodeGen.codeText.enterFunc()
        const lv_funName = `@${stmt.fn_name.name}`
        // 进入函数作用域
        this.scope.enterScope(stmt.fn_name.name)

        // 生成函数定义
        const retType = this.typeToLLVM(stmt.retType);
        this.printIR(`define ${retType} ${lv_funName}(${stmt.params.map(p => this.typeToLLVM(p.type) + ' %' + p.name).join(', ')}) {`)
        this.printIR(`entry:`)
        stmt.params.forEach(p => {
            // 添加参数到函数作用域
            const lv_name = this.scope.addVariable(p, `${stmt.fn_name.name}.${p.name}`)

            this.printIR(`${lv_name} = alloca ${this.typeToLLVM(p.type)}`);
            this.printIR(`store ${this.typeToLLVM(p.type)} %${p.name}, ${this.typeToLLVM(p.type)}* ${lv_name}`);
        })
        stmt.body.forEach(s => {
            s.accept(this);
        })
        this.printIR(`}`)
        this.scope.leaveScope()
        CodeGen.codeText.leaveFunc()
    }
    // 语句生成
    visitReturnStmt(stmt: ReturnStmt): void {
        if (stmt.value) {
            const retExpR = stmt.value.accept(this);
            this.printIR(`ret ${retExpR.type} ${retExpR.valReg}`);
        } else {
            this.printIR(`ret void`);
        }
    }

    visitContinueStmt(stmt: ContinueStmt): void {
        const startLabel = this.enclosing.at(-1)?.start
        this.printIR(`br label ${startLabel}`);
    }

    visitBreakStmt(stmt: BreakStmt): void {
        const endLabel = this.enclosing.at(-1)?.end
        this.printIR(`br label ${endLabel}`);
    }

    visitLoopStmt(stmt: LoopStmt): void {
        const n = this.sequence.loop++;
        this.scope.enterScope("loop" + n)
        const dec_body = `loop_body${n}`
        const dec_end = `loop_end${n}`
        const body_label = `%${dec_body}`
        const end_label = `%${dec_end}`
        this.enclosing.push({
            start: body_label,
            end: end_label
        })
        this.printIR(`br label ${body_label}`);
        this.printIR(`${dec_body}:`);
        stmt.body.accept(this);
        this.printIR(`br label ${body_label}`);
        this.printIR(`${dec_end}:`);
        this.enclosing.pop()
        this.scope.leaveScope()
    }
    visitForStmt(stmt: ForStmt): void {
        const n = this.sequence.for++;
        this.scope.enterScope("for" + n)

        const dec_init = `for_init${n}`
        const dec_cond = `for_cond${n}`
        const dec_inc = `for_inc${n}`
        const dec_body = `for_body${n}`
        const dec_end = `for_end${n}`

        const init_label = `%${dec_init}`
        const cond_label = `%${dec_cond}`
        const inc_label = `%${dec_inc}`
        const body_label = `%${dec_body}`
        const end_label = `%${dec_end}`
        this.enclosing.push({
            start: inc_label,
            end: end_label
        })
        this.printIR(`br label ${init_label}`);
        this.printIR(`${dec_init}:`);

        if (stmt.initializer) {
            stmt.initializer.accept(this);
        }
        this.printIR(`br label ${cond_label}`);
        this.printIR(`${dec_cond}:`);

        if (stmt.condition) {
            const condExpR = stmt.condition.accept(this);
            const cond_val = `%reg_forCond${n}`
            this.printIR(`${cond_val} = icmp ne ${condExpR.type} ${condExpR.valReg}, 0`);
            this.printIR(`br i1 ${cond_val}, label ${body_label}, label ${end_label}`);
        } else {
            this.printIR(`br label ${body_label}`);
        }

        this.printIR(`${dec_body}:`);
        stmt.body.accept(this);

        this.printIR(`br label ${inc_label}`);
        this.printIR(`${dec_inc}:`);

        if (stmt.increment) {
            stmt.increment.accept(this);
        }

        this.printIR(`br label ${cond_label}`);
        this.printIR(`${dec_end}:`);

        this.enclosing.pop()
        this.scope.leaveScope()
    }

    visitDoWhileStmt(stmt: DoWhileStmt): void {
        const n = this.sequence.doWhile++;
        this.scope.enterScope("doWhile" + n)
        const dec_body = `do_body${n}`
        const dec_cond = `do_cond${n}`
        const dec_end = `do_end${n}`

        const body_label = `%${dec_body}`
        const cond_label = `%${dec_cond}`
        const end_label = `%${dec_end}`

        this.enclosing.push({
            start: cond_label,
            end: end_label
        })

        this.printIR(`br label ${body_label}`);
        this.printIR(`${dec_body}:`);

        stmt.body.accept(this);

        this.printIR(`br label ${cond_label}`);
        this.printIR(`${dec_cond}:`);

        const condExpR = stmt.condition.accept(this);
        const cond_val = `%reg_doCond${n}`
        this.printIR(`${cond_val} = icmp ne ${condExpR.type} ${condExpR.valReg}, 0`);
        this.printIR(`br i1 ${cond_val}, label ${body_label}, label ${end_label}`);

        this.printIR(`${dec_end}:`);
        this.enclosing.pop()
        this.scope.leaveScope()
    }

    visitWhileStmt(stmt: WhileStmt): void {
        const n = this.sequence.while++;
        this.scope.enterScope("while" + n)
        //标签名
        const dec_cond = `while_cond${n}`
        const dec_body = `while_body${n}`
        const dec_end = `while_end${n}`
        const cond_label = `%${dec_cond}`
        const body_label = `%${dec_body}`
        const end_label = `%${dec_end}`

        this.enclosing.push({
            start: cond_label,
            end: end_label
        })

        this.printIR(`br label ${cond_label}`);
        this.printIR(`${dec_cond}:`);

        const condExpR = stmt.condition.accept(this);
        const cond_val = `%reg_whileCond${n}`
        this.printIR(`${cond_val} = icmp ne ${condExpR.type} ${condExpR.valReg}, 0`);
        this.printIR(`br i1 ${cond_val}, label ${body_label}, label ${end_label}`);

        this.printIR(`${dec_body}:`);
        stmt.body.accept(this);

        this.printIR(`br label ${cond_label}`);
        this.printIR(`${dec_end}:`);

        this.enclosing.pop()
        this.scope.leaveScope()
    }

    //if 语句生成
    visitIfStmt(stmt: IfStmt): void {
        const n = this.sequence.if++;
        this.scope.enterScope("if" + n)
        const condExpR = stmt.condition.accept(this);
        const dec_then = `if_then${n}`
        const dec_else = `if_else${n}`
        const dec_end = `if_end${n}`

        const then_label = `%${dec_then}`
        const else_label = `%${dec_else}`
        const end_label = `%${dec_end}`

        const cond_val = `%reg_ifCond${n}`
        this.printIR(`${cond_val} = icmp ne ${condExpR.type} ${condExpR.valReg}, 0`);

        if (stmt.elseBranch) {
            this.printIR(`br i1 ${cond_val}, label ${then_label}, label ${else_label}`);
            this.printIR(`${dec_then}:`);
            stmt.thenBranch.accept(this);
            this.printIR(`br label ${end_label}`);
            this.printIR(`${dec_else}:`);
            stmt.elseBranch.accept(this);
            this.printIR(`br label ${end_label}`);
            this.printIR(`${dec_end}:`);
        } else {
            this.printIR(`br i1 ${cond_val}, label ${then_label}, label ${end_label}`);
            this.printIR(`${dec_then}:`);
            stmt.thenBranch.accept(this);
            this.printIR(`br label ${end_label}`);
            this.printIR(`${dec_end}:`);
        }
        this.scope.leaveScope()
    }

    //块语句生成
    visitBlockStmt(stmt: BlockStmt): void {
        const n = this.sequence.block++;
        this.scope.enterScope("block" + n)
        for (const s of stmt.statements) {
            s.accept(this);
        }
        this.scope.leaveScope()
    }

    //表达式语句生成
    visitExpressionStmt(stmt: ExpressionStmt): void {
        stmt.expression.accept(this);
    }

    visitPrintStmt(stmt: PrintStmt): void {
        const exprExpR = stmt.expression.accept(this);
        this.printIR(`call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), ${exprExpR.type} ${exprExpR.valReg})`);
    }

    visitVarStmt(stmt: VarStmt): void {
        const varName = `${this.scope.currentScope.scopeName}.${stmt.variable.name}`

        const var_name = this.scope.addVariable(stmt.variable, varName)
        const varType = this.typeToLLVM(stmt.variable.type);

        if (this.scope.currentScope.scopeName === "global") {
            if (stmt.initializer) {
                if (stmt.variable.type instanceof PtrType) {
                    const initVar = stmt.initializer
                    if (initVar instanceof VariableExpr) {
                        const lv_varName = this.scope.findVariable(initVar.variable)
                        this.printDecle(`${var_name} = global ${varType} ${lv_varName}`);
                    }
                } else {
                    const initExpR = stmt.initializer.accept(this);
                    this.printDecle(`${var_name} = global ${varType} ${initExpR.valReg}`);
                }
            } else {
                this.printDecle(`${var_name} = global ${varType} zeroinitializer`);
            }
            return
        } else {
            //被闭包捕获的变量
            if (stmt.variable.inClosure) {
                this.printDecle(`${var_name} = global ${varType} zeroinitializer`);
            } else {
                this.printIR(`${var_name} = alloca ${varType}`);
            }
        }
        if (stmt.initializer) {
            if (stmt.variable.type instanceof PtrType) {
                const initVar = stmt.initializer
                if (initVar instanceof VariableExpr) {
                    const lv_varName = this.scope.findVariable(initVar.variable)
                    this.printIR(`store ${varType} ${lv_varName}, ${varType}* ${var_name}`);
                } else {
                    const initExpR = initVar.accept(this);
                    this.printIR(`store ${initExpR.type} ${initExpR.valReg}, ${varType}* ${var_name}`);
                }
            } else {
                const initExpR = stmt.initializer.accept(this);
                this.printIR(`store ${initExpR.type} ${initExpR.valReg}, ${varType}* ${var_name}`);
            }
        }
    }

    visitVarListStmt(stmt: VarListStmt): void {
        for (const v of stmt.varStmts) {
            this.visitVarStmt(v);
        }
    }


    /*-----------------------------Expr-----------------------------*/

    visitArrowExpr(expr: ArrowExpr): ExprResult {
        const leftType = this.typeToLLVM(expr.left.exprType)

        const leftReg = this.scope.findVariable(expr.left.variable)
        let rightReg = null
        if (expr.right instanceof VariableExpr) {
            rightReg = this.scope.findVariable(expr.right.variable)
        } else {
            rightReg = expr.right.value
        }
        this.printIR(`store ${leftType} ${rightReg}, ${leftType}* ${leftReg}`);
        return { type: leftType, valReg: leftReg };
    }

    //数组表达式生成
    visitArrayExpr(expr: ArrayExpr): ExprResult {
        const n = this.sequence.reg++;
        const array_type = this.typeToLLVM(expr.exprType)
        let undef_array = `undef`
        if (this.scope.currentScope.scopeName === "global") {
            undef_array = `[${expr.elements.map((e) => `${this.typeToLLVM(e.exprType)} ${e.accept(this, false).valReg}`).join(', ')} ]`
        } else {
            for (let i = 0; i < expr.elements.length; i++) {
                const elExprR = expr.elements[i].accept(this);
                const element_type = this.typeToLLVM(expr.elements[i].exprType)
                const regName = `%temp_arr${n}_${i}`
                this.printIR(`${regName} = insertvalue ${array_type} ${undef_array}, ${element_type} ${elExprR.valReg}, ${i}`);
                undef_array = regName
            }
        }

        return { type: array_type, valReg: undef_array };
    }
    visitIndexExpr(expr: IndexExpr, isLeft: boolean): ExprResult {
        const n = this.sequence.reg++;
        const targetExpR = expr.target.accept(this, isLeft)
        const targetType = targetExpR.type
        const targetVal = targetExpR.valReg

        const indexExpR = expr.index.accept(this)
        const fieldType = this.typeToLLVM(expr.exprType)
        const indexVal = indexExpR.valReg

        const indexPtr = `%reg_index_ptr${n}`
        const indexReg = `%reg_index${n}`
        if (isLeft) {
            this.printIR(`${indexPtr} = getelementptr ${targetType}, ${targetType}* ${targetVal},i32 0, i32 ${indexVal}`);
            return { type: fieldType, valReg: indexPtr };
        } else {
            const tempArr = `%temp_arr${n}`
            if (targetType.endsWith("]")) {
                this.printIR(`${tempArr} = alloca ${targetType}`);
                this.printIR(`store ${targetType} ${targetVal}, ${targetType}* ${tempArr}`);
                this.printIR(`${indexPtr} = getelementptr ${targetType}, ${targetType}* ${tempArr},i32 0, i32 ${indexVal}`);
                this.printIR(`${indexReg} = load ${fieldType}, ${fieldType}* ${indexPtr}`);
            } else {
            }
            return { type: fieldType, valReg: indexReg };
        }
    }

    visitSetIndexExpr(expr: SetIndexExpr): ExprResult {
        const index_ptr = expr.target.accept(this, true)
        const valueExpR = expr.value.accept(this)
        this.printIR(`store ${valueExpR.type} ${valueExpR.valReg}, ${index_ptr.type}* ${index_ptr.valReg}`);
        return valueExpR
    }

    //结构体表达式生成
    visitStructExpr(expr: StructExpr): ExprResult {
        const n = this.sequence.reg++;
        let undef_struct = `undef`

        const structType = expr.exprType
        if (structType instanceof StructType) {
            if (this.scope.currentScope.scopeName === "global") {
                undef_struct = `{ ${expr.fields.map((f) => `${this.typeToLLVM(f.value.exprType)} ${f.value.accept(this, false).valReg}`).join(', ')} }`
            } else {
                expr.fields.forEach((f) => {
                    const index = structType.fields.findIndex((f2) => f2.field === f.field)
                    const field_exprR = f.value.accept(this);
                    const field_type = field_exprR.type
                    const field_val = field_exprR.valReg
                    const regName = `%temp_struct${n}_${f.field}`
                    this.printIR(`${regName} = insertvalue ${this.typeToLLVM(expr.exprType)} ${undef_struct}, ${field_type} ${field_val}, ${index}`);
                    undef_struct = regName;
                })
            }

        }


        return { type: this.typeToLLVM(expr.exprType), valReg: undef_struct };
    }

    // 逻辑表达式生成
    visitLogicalBinaryExpr(expr: LogicalBinaryExpr): ExprResult {
        const leftExpR = expr.left.accept(this);
        const rightExpR = expr.right.accept(this);
        const n = this.sequence.reg++;
        const logical_val = `%reg_logical${n}`

        if (expr.operator.lexeme === '&&') {
            this.printIR(`${logical_val} = and i1 ${leftExpR.valReg}, ${rightExpR.valReg}`);
        } else {
            this.printIR(`${logical_val} = or i1 ${leftExpR.valReg}, ${rightExpR.valReg}`);
        }

        return { type: 'i1', valReg: logical_val };
    }
    //赋值表达式生成
    visitAssignExpr(expr: AssignExpr): ExprResult {
        const valueExpR = expr.value.accept(this);
        const var_ = expr.variable.accept(this, true)
        const varType = var_.type
        const var_name = var_.valReg
        this.printIR(`store ${valueExpR.type} ${valueExpR.valReg}, ${varType}* ${var_name}`);
        return valueExpR
    }

    //逗号表达式生成
    visitCommaExpr(expr: CommaExpr): ExprResult {
        expr.left.accept(this);
        return expr.right.accept(this);
    }

    //二元表达式生成
    visitBinaryExpr(expr: BinaryExpr): ExprResult {
        const n = this.sequence.reg++;
        const leftExpR = expr.left.accept(this);
        const rightExpR = expr.right.accept(this);
        const leftType = leftExpR.type
        const left = leftExpR.valReg
        const right = rightExpR.valReg

        const retType = this.typeToLLVM(expr.exprType)

        const bin_val = `%reg_bin${n}`


        switch (expr.operator.lexeme) {
            case '+':
                this.printIR(`${bin_val} = add ${leftType} ${left}, ${right}`);
                break;
            case '-':
                this.printIR(`${bin_val} = sub ${leftType} ${left}, ${right}`);
                break;
            case '*':
                this.printIR(`${bin_val} = mul ${leftType} ${left}, ${right}`);
                break;
            case '/':
                this.printIR(`${bin_val} = sdiv ${leftType} ${left}, ${right}`);
                break;
            case '%':
                this.printIR(`${bin_val} = srem ${leftType} ${left}, ${right}`);
                break;
            case '==':
                this.printIR(`${bin_val} = icmp eq ${leftType} ${left}, ${right}`);
                break;
            case '!=':
                this.printIR(`${bin_val} = icmp ne ${leftType} ${left}, ${right}`);
                break;
            case '<':
                this.printIR(`${bin_val} = icmp slt ${leftType} ${left}, ${right}`);
                break;
            case '<=':
                this.printIR(`${bin_val} = icmp sle ${leftType} ${left}, ${right}`);
                break;
            case '>':
                this.printIR(`${bin_val} = icmp sgt ${leftType} ${left}, ${right}`);
                break;
            case '>=':
                this.printIR(`${bin_val} = icmp sge ${leftType} ${left}, ${right}`);
                break;
        }

        return { type: retType, valReg: bin_val };
    }

    //一元表达式生成
    visitUnaryExpr(expr: UnaryExpr): ExprResult {
        const rightExpR = expr.right.accept(this);
        const rightType = rightExpR.type
        const n = this.sequence.reg++;
        const unary_val = `%reg_unary${n}`
        switch (expr.operator.lexeme) {
            case '-':
                this.printIR(`${unary_val} = sub ${rightType} 0, ${rightExpR.valReg}`);
                break;
            case '!':
                this.printIR(`${unary_val} = icmp eq ${rightType} ${rightExpR.valReg}, 0`);
                break;
        }

        return { type: rightType, valReg: unary_val };
    }

    //前缀自增自减表达式生成
    visitPrefixSelfExpr(expr: PrefixSelfExpr): ExprResult {
        const n = this.sequence.reg++;
        const var_ = expr.right
        const rightExpR = var_.accept(this, true);
        const rightType = rightExpR.type
        const rightReg = rightExpR.valReg
        let ir_var_name = rightReg

        let newReg = `%reg_prefix${n}`
        const oldReg = `%reg_old${n}`

        if (expr.operator.lexeme === '++') {
            this.printIR(`${oldReg} = load ${rightType} , ${rightType}* ${rightReg}`);
            this.printIR(`${newReg} = add ${rightType} ${oldReg}, 1`);
        } else {
            this.printIR(`${oldReg} = load ${rightType} , ${rightType}* ${rightReg}`);
            this.printIR(`${newReg} = sub ${rightType} ${oldReg}, 1`);
        }
        this.printIR(`store ${rightType} ${newReg}, ${rightType}* ${ir_var_name}`);

        return { type: rightType, valReg: newReg };
    }

    //后缀表达式生成
    visitSuffixSelfExpr(expr: SuffixSelfExpr): ExprResult {
        const n = this.sequence.reg++;
        const left = expr.left;

        const leftExpR = left.accept(this, true)
        const leftType = leftExpR.type
        const leftReg = leftExpR.valReg
        let newReg = `%reg_suffix${n}`

        let ir_var_name = leftReg

        const oldReg = `%reg_old${n}`
        if (expr.operator.lexeme === '++') {

            this.printIR(`${oldReg} = load ${leftType} , ${leftType}* ${leftReg}`);
            this.printIR(`${newReg} = add ${leftType} ${oldReg}, 1`);
        } else if (expr.operator.lexeme === '--') {
            this.printIR(`${oldReg} = load ${leftType} , ${leftType}* ${leftReg}`);
            this.printIR(`${newReg} = sub ${leftType} ${oldReg}, 1`);
        }

        this.printIR(`store ${leftType} ${newReg}, ${leftType}* ${ir_var_name}`);
        return { type: leftType, valReg: oldReg };
    }

    visitCallExpr(expr: CallExpr): ExprResult {
        const n = this.sequence.reg++;
        const args = expr.args.map(arg => {
            const argExpR = arg.accept(this)
            return {
                value: argExpR.valReg,
                type: argExpR.type
            }
        });
        const calleeExpR = expr.callee.accept(this);
        const retType = this.typeToLLVM(expr.exprType)
        const var_name = `%reg_call${n}`
        if (retType == 'void') {
            this.printIR(`call ${retType} ${calleeExpR.valReg}(${args.map(arg => `${arg.type} ${arg.value}`).join(', ')})`);
        } else {
            this.printIR(`${var_name} = call ${retType} ${calleeExpR.valReg}(${args.map(arg => `${arg.type} ${arg.value}`).join(', ')})`);
        }
        return { type: retType, valReg: var_name };
    }


    visitGetFieldExpr(expr: GetFieldExpr, isLeft: boolean): ExprResult {
        const n = this.sequence.reg++;
        const leftExpR = expr.target.accept(this, isLeft)
        const leftType = leftExpR.type
        const leftVal = leftExpR.valReg
        const field_type = this.typeToLLVM(expr.exprType)
        let retType = leftType
        const field_val = `%reg_field${expr.field}_${n}`
        let field_index = -1
        if (expr.target.exprType instanceof StructType) {
            field_index = expr.target.exprType.fields.findIndex((f) => f.field === expr.field)
        } else if (expr.target.exprType instanceof PtrType) {
            if (expr.target.exprType.elementType instanceof StructType) {
                field_index = expr.target.exprType.elementType.fields.findIndex((f) => f.field === expr.field)
            }
        }
        if (field_index === -1) {
            throw new Error("Invalid field expression.")
        }
        if (isLeft) {
            this.printIR(`${field_val} = getelementptr ${leftType}, ${leftType}* ${leftVal}, i32 0, i32 ${field_index}`);
            retType = field_type
        } else {
            if (leftType.endsWith("*")) { // 左值为指针
                this.printIR(`${field_val} = load ${field_type}, ${leftType} ${leftVal}`);
            } else {
                this.printIR(`${field_val} = extractvalue ${leftType} ${leftVal}, ${field_index}`);
                retType = field_type
            }
        }
        return { type: retType, valReg: field_val };
    }
    visitSetFieldExpr(expr: SetFieldExpr): ExprResult {
        const leftExpR = expr.target.accept(this, true)
        const valueExpR = expr.value.accept(this);
        this.printIR(`store ${valueExpR.type} ${valueExpR.valReg}, ${leftExpR.type}* ${leftExpR.valReg}`);
        return valueExpR;
    }
    //变量表达式生成 变量表达式 => 变量名,函数名
    visitVariableExpr(expr: VariableExpr, isLeft: boolean): ExprResult {
        const var_name = this.scope.findVariable(expr.variable);
        let varType = this.typeToLLVM(expr.variable.type);
        const n = this.sequence.reg++;
        let reg_name = `%reg_${expr.variable.name}${n}`
        if (isLeft) {
            if (expr.variable.type instanceof PtrType) {
                const reg_ptr = `${reg_name}_ptr${n}`
                this.printIR(`${reg_ptr} = load ${varType}, ${varType}* ${var_name}`);
                varType = this.typeToLLVM(expr.variable.type.elementType)
                return { type: varType, valReg: reg_ptr };
            }
            return { type: varType, valReg: var_name };
        }
        if (expr.variable.type instanceof PtrType) {
            const reg_ptr = `${reg_name}_ptr${n}`
            const elementType = this.typeToLLVM(expr.variable.type.elementType)
            this.printIR(`${reg_ptr} = load ${varType}, ${varType}* ${var_name}`);
            this.printIR(`${reg_name} = load ${elementType}, ${elementType}* ${reg_ptr}`);
            return { type: elementType, valReg: reg_name };
        } else {
            this.printIR(`${reg_name} = load ${varType}, ${varType}* ${var_name}`);
            return { type: varType, valReg: reg_name };
        }
    }

    visitFunctionExpr(expr: FunctionExpr): ExprResult {
        const n = this.sequence.reg++;

        const fun = expr.fun_lable
        // 函数表达式 => 函数名
        const lv_fnName = `@${expr.fun_lable.name}`
        const retType = this.typeToLLVM(fun.retType)
        const params = fun.paramsType.map(p => this.typeToLLVM(p))

        if (expr.body) {
            CodeGen.codeText.enterFunc()
            this.scope.enterScope(expr.fun_lable.name)
            this.printIR(`define ${retType} ${lv_fnName} (${expr.params.map(p => this.typeToLLVM(p.type) + ' %' + p.name).join(', ')}) {`)
            this.printIR(`entry:`)
            expr.params?.forEach(p => {
                const lv_name = this.scope.addVariable(p, `${expr.fun_lable.name}.${p.name}`)
                this.printIR(`${lv_name} = alloca ${this.typeToLLVM(p.type)}`);
                this.printIR(`store ${this.typeToLLVM(p.type)} %${p.name}, ${this.typeToLLVM(p.type)}* ${lv_name}`);
            })
            expr.body.forEach(s => {
                s.accept(this);
            })
            this.printIR(`}`)
            this.scope.leaveScope()
            CodeGen.codeText.leaveFunc()
        }

        // const reg_name = `%reg_function${n}`
        // this.printIR(`${reg_name} = bitcast ${retType} (${params.join(', ')})* ${lv_fnName} to ${retType} (${params.join(', ')})*`);

        return { type: retType, valReg: lv_fnName };
    }

    visitInitializerExpr(expr: InitializerExpr): ExprResult {
        const initExpR = expr.initializer.accept(this);
        return { type: this.typeToLLVM(expr._var.type), valReg: initExpR.valReg };
    }

    visitLiteralExpr(expr: LiteralExpr): ExprResult {
        return { type: this.typeToLLVM(expr.exprType), valReg: expr.value };
    }

    visitGroupingExpr(expr: GroupingExpr): ExprResult {
        return expr.expression.accept(this);
    }

    private printIR(code: string): void {
        CodeGen.codeText.addFuncIr(code)
    }
    private printDecle(code: string): void {
        CodeGen.codeText.addDecle(code)
    }

    private typeToLLVM(type: DataType): string {
        if (type instanceof SimpleType) {
            switch (type.simpleKind) {
                case SimpleKind.Int:
                    return "i32";
                case SimpleKind.Boolean:
                    return "i1";
                case SimpleKind.Void:
                    return "void";
                case SimpleKind.Char:
                    return "i8";
                case SimpleKind.Null:
                    return "i8*";
            }
        }
        if (type instanceof FunType) {
            return "i32*";
        }
        if (type instanceof StructType) {
            return `%${this.scope.findDeclare(type)}`
        }
        if (type instanceof ArrayType) {
            return `[${type.len} x ${this.typeToLLVM(type.elementType)}]`
        }
        //指针类型  
        if (type instanceof PtrType) {
            return `${this.typeToLLVM(type.elementType)}*`
        }
        return "null";
    }
}



