import { ArrayExpr, AssignExpr, BinaryExpr, CallExpr, CommaExpr, Expr, ExprVisitor, GetFieldExpr, GroupingExpr, IndexExpr, LiteralExpr, LogicalBinaryExpr, PrefixSelfExpr, SetFieldExpr, SetIndexExpr, StructExpr, SuffixSelfExpr, UnaryExpr, VariableExpr } from "../Ast/Expr";
import { BlockStmt, BreakStmt, ContinueStmt, DoWhileStmt, ExpressionStmt, ForStmt, FunctionStmt, IfStmt, LoopStmt, PrintStmt, ReturnStmt, Stmt, StmtVisitor, StructStmt, VarListStmt, VarStmt, WhileStmt } from "../Ast/Stmt";
import { ArrayVar, FuncVar, FunLable, Var } from "../Parse/Symbol";
import { ArrayType, DataType, FunType, SimpleKind, SimpleType, StructType } from "../Parse/TypeDeclar";
import { Scope } from "./Scope";

type ExprResult = {
    type: string,
    valReg: string
}

type EncloseLoop = {
    start: string, //循环开始标签
    end: string //循环结束标签
}



export class CodeGen implements ExprVisitor<ExprResult>, StmtVisitor<void> {
    private globalVars: Var[] = [];
    private globalVarListStmt: VarListStmt[] = []; //全局变量列表
    private globalFunctionStmt: FunctionStmt[] = []; //全局变量
    private globalStructStmt: StructStmt[] = []; //全局结构体
    static codeText: string = "";
    private scope: Scope = new Scope(); // 作用域 index 0为全局作用域
    private enclosing: EncloseLoop[] = []
    private sequence: {
        loop: number,
        for: number,
        doWhile: number,
        while: number,
        if: number,
        reg: number,
    } = { loop: 0, for: 0, doWhile: 0, while: 0, if: 0, reg: 0 }
    private functionDeclarations: string[] = []; //函数声明

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
            if (stmt instanceof StructStmt) {
                this.globalStructStmt.push(stmt);
            }
        });
        this.globalStructStmt.forEach(stmt => {
            this.visitStructStmt(stmt)
        })
        this.globalVarListStmt.forEach(stmt => {
            this.visitVarListStmt(stmt)
        })
        this.globalFunctionStmt.forEach(stmt => {
            this.visitFunctionStmt(stmt)
        })


        console.log('CodeGen.codeText', CodeGen.codeText);
        return CodeGen.codeText;
    }


    visitStructStmt(stmt: StructStmt): void {
        this.printIR(`%${stmt.structure.name} = type { ${Array.from(stmt.structure.fields.entries()).map(([name, type]) => typeToLLVM(type)).join(', ')} }`);
    }

    visitFunctionStmt(stmt: FunctionStmt): void {
        const lv_funName = stmt.fn_name.name === "main" ? "@main" : `@fn_${stmt.fn_name}` //函数名
        // 添加函数变量到全局作用域
        this.scope.addVariable(stmt.fn_name, lv_funName)
        // 进入函数作用域
        this.scope.enterScope()
        // 添加参数到函数作用域
        stmt.params.forEach(p => {
            this.scope.addVariable(p, `${p.name}_P`)
        })
        // 生成函数定义
        const retType = typeToLLVM(stmt.retType);
        this.printIR(`define ${retType} ${lv_funName}(${stmt.params.map(p => typeToLLVM(p.type) + ' ' + this.scope.findVariable(p)).join(', ')}) {`)
        this.printIR(`entry:`)
        stmt.params.forEach(p => {
            const lv_name = this.scope.findVariable(p)
            this.printIR(`${lv_name} = alloca ${typeToLLVM(p.type)}`);
            this.printIR(`store ${typeToLLVM(p.type)} ${lv_name}, ${typeToLLVM(p.type)}* ${lv_name}`);
        })
        stmt.body.forEach(s => {
            s.accept(this);
        })
        this.printIR(`}`)
        this.scope.leaveScope()
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
        this.scope.enterScope()
        const n = this.sequence.loop++;
        const dec_body = `loop_body_${n}`
        const dec_end = `loop_end_${n}`
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
        this.scope.enterScope()
        const n = this.sequence.for++;

        const dec_init = `for_init_${n}`
        const dec_cond = `for_cond_${n}`
        const dec_inc = `for_inc_${n}`
        const dec_body = `for_body_${n}`
        const dec_end = `for_end_${n}`

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
            const cond_val = `%reg_forCond_${n}`
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
        this.scope.enterScope()
        const n = this.sequence.doWhile++;
        const dec_body = `do_body_${n}`
        const dec_cond = `do_cond_${n}`
        const dec_end = `do_end_${n}`

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
        const cond_val = `%reg_doCond_${n}`
        this.printIR(`${cond_val} = icmp ne ${condExpR.type} ${condExpR.valReg}, 0`);
        this.printIR(`br i1 ${cond_val}, label ${body_label}, label ${end_label}`);

        this.printIR(`${dec_end}:`);
        this.enclosing.pop()
        this.scope.leaveScope()
    }

    visitWhileStmt(stmt: WhileStmt): void {
        this.scope.enterScope()
        const n = this.sequence.while++;
        //标签名
        const dec_cond = `while_cond_${n}`
        const dec_body = `while_body_${n}`
        const dec_end = `while_end_${n}`
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
        const cond_val = `%reg_whileCond_${n}`
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
        this.scope.enterScope()
        const n = this.sequence.if++;
        const condExpR = stmt.condition.accept(this);
        const dec_then = `if_then_${n}`
        const dec_else = `if_else_${n}`
        const dec_end = `if_end_${n}`

        const then_label = `%${dec_then}`
        const else_label = `%${dec_else}`
        const end_label = `%${dec_end}`

        const cond_val = `%reg_ifCond_${n}`
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
        this.scope.enterScope()
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
        const var_name = this.scope.addVariable(stmt.variable, stmt.variable.name)
        if (this.globalVars.find(v => v === stmt.variable)) {
            // 全局变量
            const varType = typeToLLVM(stmt.variable.type);
            if (stmt.initializer) {
                const initExpR = stmt.initializer.accept(this);
                this.printIR(`${var_name} = global ${varType} ${initExpR.valReg}`);
            } else {
                this.printIR(`${var_name} = global ${varType}`);
            };
        } else {
            // 数组变量
            if (stmt.variable instanceof ArrayVar) {
                const arrayType = stmt.variable.type as ArrayType
                const varType = typeToLLVM(arrayType)
                this.printIR(`${var_name} = alloca ${varType}`);
                if (stmt.initializer) {
                    const initExpR = stmt.initializer.accept(this);
                    this.printIR(`store ${initExpR.type} ${initExpR.valReg}, ${varType}* ${var_name}`);
                }
            } else {
                const varType = typeToLLVM(stmt.variable.type);
                // 局部变量
                this.printIR(`${var_name} = alloca ${varType}`);
                if (stmt.initializer) {
                    const initExpR = stmt.initializer.accept(this);
                    this.printIR(`store ${initExpR.type} ${initExpR.valReg}, ${varType}* ${var_name}`);
                }
            }
        }
    }

    visitVarListStmt(stmt: VarListStmt): void {
        for (const v of stmt.varStmts) {
            this.visitVarStmt(v);
        }
    }


    /*-----------------------------Expr-----------------------------*/

    //数组表达式生成
    visitArrayExpr(expr: ArrayExpr): ExprResult {
        const n = this.sequence.reg++;
        const array_type = typeToLLVM(expr.exprType)
        let undef_array = `undef`
        for (let i = 0; i < expr.elements.length; i++) {
            const elExprR = expr.elements[i].accept(this);
            const element_type = typeToLLVM(expr.elements[i].exprType)
            const regName = `%temp_${n}_${i}`
            this.printIR(`${regName} = insertvalue ${array_type} ${undef_array}, ${element_type} ${elExprR.valReg}, ${i}`);
            undef_array = regName
        }

        return { type: array_type, valReg: undef_array };
    }

    visitIndexExpr(expr: IndexExpr): ExprResult {
        const n = this.sequence.reg++;
        const targetExpR = expr.target.accept(this)
        const taExprType = expr.target.exprType as ArrayType
        const lvType = targetExpR.type
        const elementType = typeToLLVM(taExprType.elementType)
        const indexExpR = expr.index.accept(this)

        const index_val = `%reg_index_${n}`
        const tempArr = `%temp_arr_alloca_${n}`
        this.printIR(`${tempArr} = alloca ${lvType}`);
        this.printIR(`store ${lvType} ${targetExpR.valReg}, ${lvType}* ${tempArr}`);
        this.printIR(`${index_val}_1 = getelementptr ${lvType}, ${lvType}* ${tempArr},${indexExpR.type} 0, ${indexExpR.type} ${indexExpR.valReg}`);
        this.printIR(`${index_val} = load ${elementType}, ${elementType}* ${index_val}_1`);
        return { type: elementType, valReg: index_val };
    }

    visitSetIndexExpr(expr: SetIndexExpr): ExprResult {
        const n = this.sequence.reg++;
        const arrayExpR = expr.array.accept(this)
        const indexExpR = expr.index.accept(this)
        const valueExpR = expr.value.accept(this)
        const arrayType = arrayExpR.type
        const elementType = valueExpR.type
        const index_val = `%reg_index_${n}`
        const elemPtr = `%reg_elemPtr_${n}`
        this.printIR(`${elemPtr} = getelementptr ${arrayType}, ${arrayType}* ${arrayExpR.valReg},${indexExpR.type} 0, ${indexExpR.type} ${indexExpR.valReg}`);
        this.printIR(`store ${elementType} ${valueExpR.valReg}, ${elementType}* ${elemPtr}`);
        return { type: elementType, valReg: valueExpR.valReg };
    }

    //结构体表达式生成
    visitStructExpr(expr: StructExpr): ExprResult {
        const n = this.sequence.reg++;
        let undef_struct = `undef`
        Array.from(expr.fields.entries()).forEach(([name, value]) => {
            const structType = expr.exprType as StructType
            const index = Array.from(structType.structure.fields.entries()).findIndex(([na, type]) => na === name)
            const field_exprR = value.accept(this);
            const field_type = field_exprR.type
            const field_val = field_exprR.valReg
            const regName = `%temp_${n}_${name}`
            this.printIR(`${regName} = insertvalue ${typeToLLVM(expr.exprType)} ${undef_struct}, ${field_type} ${field_val}, ${index}`);
            undef_struct = regName;
        })

        return { type: typeToLLVM(expr.exprType), valReg: undef_struct };
    }

    // 逻辑表达式生成
    visitLogicalBinaryExpr(expr: LogicalBinaryExpr): ExprResult {
        const leftExpR = expr.left.accept(this);
        const rightExpR = expr.right.accept(this);
        const n = this.sequence.reg++;
        const logical_val = `%reg_logical_${n}`

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
        const varType = typeToLLVM(expr.variable.type)
        const var_name = this.scope.findVariable(expr.variable)
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

        const retType = typeToLLVM(expr.exprType)

        const bin_val = `%reg_bin_${n}`


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
        const unary_val = `%reg_unary_${n}`
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
        const var_ = expr.right as VariableExpr;//变量自身
        let ir_var_name = this.scope.findVariable(var_.variable) //ir中变量
        const rightExpR = expr.right.accept(this);
        const rightType = typeToLLVM(expr.right.exprType)
        let new_val = `%reg_prefix_${n}`


        if (this.globalVars.find(v => v === var_.variable)) {
            if (expr.operator.lexeme === '++') {
                this.printIR(`${new_val} = add ${rightType} ${rightExpR.valReg}, 1`);
            } else {
                this.printIR(`${new_val} = sub ${rightType} ${rightExpR.valReg}, 1`);
            }
        } else {
            if (expr.operator.lexeme === '++') {
                this.printIR(`${new_val} = add ${rightType} ${rightExpR.valReg}, 1`);
            } else {
                this.printIR(`${new_val} = sub ${rightType} ${rightExpR.valReg}, 1`);
            }
        }
        this.printIR(`store ${rightType} ${new_val}, ${rightType}* ${ir_var_name}`);

        return { type: rightType, valReg: new_val };
    }

    //后缀表达式生成
    visitSuffixSelfExpr(expr: SuffixSelfExpr): ExprResult {
        const n = this.sequence.reg++;
        const left = expr.left;

        const leftExpR = left.accept(this)
        const leftType = leftExpR.type
        const leftReg = leftExpR.valReg
        let new_val = `%reg_suffix_${n}`

        let ir_var_name = null
     
        if (left instanceof VariableExpr) {
           const leftVar = left.variable
           ir_var_name = this.scope.findVariable(leftVar)
        } else if (left instanceof GetFieldExpr) {
            ir_var_name = this.getFieldPtr(left).valReg
        }
        if (expr.operator.lexeme === '++') {
            this.printIR(`${new_val} = add ${leftType} ${leftReg}, 1`);
        } else if (expr.operator.lexeme === '--') {
            this.printIR(`${new_val} = sub ${leftType} ${leftReg}, 1`);
        }

        this.printIR(`store ${leftType} ${new_val}, ${leftType}* ${ir_var_name}`);
        return leftExpR;
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
        const retType = typeToLLVM(expr.exprType)
        const var_name = `%reg_call_${n}`
        if (retType == 'void') {
            this.printIR(`call ${retType} ${calleeExpR.valReg}(${args.map(arg => `${arg.type} ${arg.value}`).join(', ')})`);
        } else {
            this.printIR(`${var_name} = call ${retType} ${calleeExpR.valReg}(${args.map(arg => `${arg.type} ${arg.value}`).join(', ')})`);
        }
        return { type: retType, valReg: var_name };
    }

    getFieldPtr(expr: GetFieldExpr): ExprResult {
        const n = this.sequence.reg++;
        let targetExpR = null
        if (expr.target instanceof GetFieldExpr) {
            targetExpR = this.getFieldPtr(expr.target)
        } else {
            const targetVar = expr.target as VariableExpr
            targetExpR = {
                type: typeToLLVM(targetVar.variable.type),
                valReg: this.scope.findVariable(targetVar.variable)
            }
        }
        const targetType = targetExpR.type
        const targetvar = targetExpR.valReg

        const structType = expr.target.exprType as StructType
        let field_type = null;
        const field_index = Array.from(structType.structure.fields.entries()).findIndex(([name, value]) => {
            if (name === expr.field) {
                field_type = typeToLLVM(value)
                return true
            }
            return false
        })
        const regFieldPtr = `%reg_field_ptr_${expr.field}_${n}`
        this.printIR(`${regFieldPtr} = getelementptr ${targetType}, ${targetType}* ${targetvar}, i32 0, i32 ${field_index}`);
        return { type: field_type, valReg: regFieldPtr };

    }

    visitGetFieldExpr(expr: GetFieldExpr): ExprResult {
        const n = this.sequence.reg++;
        const regName = `%regfield_${expr.field}_${n}`
        const fieldPtr = this.getFieldPtr(expr)
        const field_type = fieldPtr.type
        const regFieldPtr = fieldPtr.valReg
        this.printIR(`${regName} = load ${field_type}, ${field_type}* ${regFieldPtr}`);
        return { type: field_type, valReg: regName };
    }
    visitSetFieldExpr(expr: SetFieldExpr): ExprResult {
        const n = this.sequence.reg++;
        const valueExpR = expr.value.accept(this);
        const fieldPtr = this.getFieldPtr(expr)
        this.printIR(`store ${valueExpR.type} ${valueExpR.valReg}, ${fieldPtr.type}* ${fieldPtr.valReg}`);
        return valueExpR;
    }
    //变量表达式生成 变量表达式 => 变量名,函数名
    visitVariableExpr(expr: VariableExpr): ExprResult {
        const var_name = this.scope.findVariable(expr.variable);
        const varType = typeToLLVM(expr.variable.type);
        const n = this.sequence.reg++;
        const var_name_n = `${var_name}_reg_${n}`

        //函数类型的变量
        if (expr.variable instanceof FunLable) {
            const funVar = expr.variable as FuncVar
            const retType = typeToLLVM(funVar.retType) //函数变量 的返回值类型
            const params = funVar.paramTypes.map(p => typeToLLVM(p))
            this.printIR(`${var_name_n} = bitcast ${retType} (${params.join(', ')})* ${var_name} to ${retType} (${params.join(', ')})*`);
            return { type: retType, valReg: var_name_n };
        } else {
            this.printIR(`${var_name_n} = load ${varType}, ${varType}* ${var_name}`);
            return { type: varType, valReg: var_name_n };
        }
    }

    visitLiteralExpr(expr: LiteralExpr): ExprResult {
        return { type: typeToLLVM(expr.exprType), valReg: expr.value.toString() };
    }

    visitGroupingExpr(expr: GroupingExpr): ExprResult {
        return expr.expression.accept(this);
    }

    private printIR(code: string): void {
        CodeGen.codeText += code + '\n';
    }
}



function typeToLLVM(type: DataType): string {
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
        return `%${type.structure.name}`
    }
    if (type instanceof ArrayType) {
        return `[${type.len} x ${typeToLLVM(type.elementType)}]`
    }
    return "null";
}   