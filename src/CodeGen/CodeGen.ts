import { AssignExpr, BinaryExpr, CallExpr, CommaExpr, Expr, ExprVisitor, GroupingExpr, LiteralExpr, LogicalBinaryExpr, SuffixSelfExpr, UnaryExpr, VariableExpr } from "../Ast/Expr";
import { BlockStmt, BreakStmt, ContinueStmt, DoWhileStmt, ExpressionStmt, ForStmt, FunctionStmt, IfStmt, PrintStmt, ReturnStmt, Stmt, StmtVisitor, VarListStmt, VarStmt, WhileStmt } from "../Ast/Stmt";
import { Var } from "../Parse/Symbol";
import { VarType } from "../Lexer/Token";
type EncloseLoop = {
    start: string, //循环开始标签
    end: string //循环结束标签
}
const paramRegister = ["rdi", "rsi", "rdx", "rcx", "r8", "r9"]
export class CodeGen implements ExprVisitor<void>, StmtVisitor<void> {

    private globalVars: Var[] = [];
    private globalVarStmt: VarStmt[] = [];
    static codeText: string = "";

    private sequence: number = 0;

    private stackPtr: number = 0;
    constructor() {
    }





    enclosing: EncloseLoop[] = []

    generateCode(programAst: {
        globalVars: Var[];
        stmt: Stmt[];
    }): string {
        this.globalVars = programAst.globalVars;
        programAst.stmt.forEach(stmt => { //全局变量声明
            if (stmt instanceof VarStmt) {
                this.globalVarStmt.push(stmt)
            }
        })

        this.program()
        this.main()
        for (const stmt of programAst.stmt) {
            if (stmt instanceof VarStmt) {
            } else {
                stmt.accept(this)
            }
        }
        // this.endProgram()
        this.printLab(`section .note.GNU-stack noalloc noexec nowrite progbits`)

        console.log(CodeGen.codeText);
        return CodeGen.codeText;
    }



    // 语句语法生成 

    visitReturnStmt(stmt: ReturnStmt): void {
        if (stmt.value) {
            stmt.value.accept(this)
        } else {
            this.printAsmCode(`mov rax, 0`)
        }
        this.printAsmCode(`mov rsp, rbp`) //恢复 rsp
        this.printAsmCode(`pop rbp`)//恢复调用者的 rbp
        this.printAsmCode(`ret`)
    }

    visitFunctionStmt(stmt: FunctionStmt): void {
        let n = this.sequence++
        let funcStackSpace = 0;
        //函数参数,寄存器

        for (let i = 0; i < stmt.params.length; i++) {
            funcStackSpace += 8;
            stmt.params[i].offset = -1 * funcStackSpace;
            if (i >= paramRegister.length - 1) {
                //超过参数寄存器的参数 直接访问起在栈中的位置
                break
            }
        }
        for (const local of stmt.locals) {
            funcStackSpace += 8;
            local.offset = -1 * funcStackSpace;
        }

        this.printLab(``)
        this.printLab(`;函数声明`)
        this.printAsmCode(`jmp ${stmt.fn_name.name}_end`) //跳转到函数结束标签
        this.printLab(`${stmt.fn_name.name}:`)
        this.printAsmCode(`push rbp`) //保存调用者的 rbp 基指
        this.printAsmCode(`mov rbp, rsp`) //设置当前栈帧的基址
        this.printAsmCode(`sub rsp, ${funcStackSpace}`)//分配栈空间
        this.printLab(`;函数参数`)

        stmt.params.forEach((param, index) => {
            if (paramRegister[index]) {
                this.printAsmCode(`mov [rbp ${param.offset}], ${paramRegister[index]}`)//将参数存入栈帧中
            } else {
                //this.printAsmCode(`mov [rbp ${param.offset}], rsi`)//将参数存入栈帧中
                param.offset = + (8 * (index - paramRegister.length + 2)) //超过参数寄存器的参数 直接访问起在栈中的位置，当前函数的栈帧，先压栈 返回地址 和 rbp 之后是局部变量
            }
        })


        stmt.body.accept(this)
        this.printLab(`${stmt.fn_name.name}_end:`)
        this.printLab(`;函数声明结束`)
        this.printLab(``)
    }

    visitContinueStmt(stmt: ContinueStmt): void {
        this.printAsmCode(`jmp ${this.enclosing.at(-1).start}`)//跳转到最近的循环开始标签
    }

    visitBreakStmt(stmt: BreakStmt): void {
        this.printAsmCode(`jmp ${this.enclosing.at(-1).end}`)//跳转到最近的循环结束标签
    }
    visitForStmt(stmt: ForStmt): void {
        let n = this.sequence++
        this.enclosing.push({
            start: `for_increment${n}`,
            end: `for_end${n}`
        })
        this.printLab(`for${n}:`)
        if (stmt.initializer) {
            stmt.initializer.accept(this)
        }
        this.printLab(`for_condition${n}:`)
        if (stmt.condition) {
            stmt.condition.accept(this)
            this.printAsmCode(`cmp rax, 0`)
            this.printAsmCode(`je for_end${n}`)
        }
        stmt.body.accept(this)
        this.printLab(`for_increment${n}:`)
        if (stmt.increment) {
            stmt.increment.accept(this)
        }
        this.printAsmCode(`jmp for_condition${n}`)
        this.printLab(`for_end${n}:`)
        this.enclosing.pop()
    }


    visitDoWhileStmt(stmt: DoWhileStmt): void {
        let n = this.sequence++
        this.enclosing.push({
            start: `do${n}`,
            end: `do_end${n}`
        })
        this.printLab(`do${n}:`)
        stmt.body.accept(this)//先执行循环体
        stmt.condition.accept(this)
        this.printAsmCode(`cmp rax, 0`)
        this.printAsmCode(`jne do${n}`)
        this.printLab(`do_end${n}:`)
        this.enclosing.pop()
    }

    visitWhileStmt(stmt: WhileStmt): void {
        let n = this.sequence++
        this.enclosing.push({
            start: `while${n}`,
            end: `while_end${n}`
        }
        )
        this.printLab(`while${n}:`)
        stmt.condition.accept(this)
        this.printAsmCode(`cmp rax, 0`)
        this.printAsmCode(`je  while_end${n}`)
        stmt.body.accept(this)
        this.printAsmCode(`jmp while${n}`)
        this.printLab(`while_end${n}:`)
        this.enclosing.pop()
    }


    visitIfStmt(stmt: IfStmt): void {
        let n = this.sequence++
        this.printLab(``)
        this.printLab(`;if 语句`)
        stmt.condition.accept(this)
        this.push()
        this.printAsmCode(`cmp rax, 0`)
        if (stmt.elseBranch) {
            this.printAsmCode(`je  else${n}`)
        } else {
            this.printAsmCode(`je  if_end${n}`)
        }

        stmt.thenBranch.accept(this)
        this.printAsmCode(`jmp if_end${n}`)
        if (stmt.elseBranch) {
            this.printLab(`else${n}:`)
            stmt.elseBranch.accept(this)
        }
        this.printLab(`if_end${n}:`)
    }

    visitBlockStmt(stmt: BlockStmt): void {
        for (const s of stmt.statements) {
            s.accept(this)
        }
    }

    visitExpressionStmt(stmt: ExpressionStmt): void {
        stmt.expression.accept(this)
        this.push()
    }
    visitPrintStmt(stmt: PrintStmt): void {
        let value = stmt.expression
        value.accept(this)
        this.printLab(``)
        this.printLab(`;调用 printf`)
        this.printAsmCode(`lea rdi, [rel format]`)
        this.printAsmCode(`mov rsi, rax`)//rax存放结果
        this.printAsmCode(`xor eax, eax`)//对于 printf 这样的可变参数函数，eax 必须设置为 0，表示没有使用向量寄存器（如 XMM 寄存器）来传递参数。
        this.printAsmCode(`call printf wrt ..plt`)//通过 PLT 调用 printf
    }
    visitVarStmt(stmt: VarStmt): void {//变量声明语句
        if (stmt.initializer) {
            //如何当前变量是否全局变量
            if (this.globalVars.find(v => v === stmt.variable)) {
                //全局变量
                stmt.initializer.accept(this)
                this.printAsmCode(`mov [${stmt.variable.name}], rax`)
            } else {
                this.printAsmCode(`lea rax, [rbp ${stmt.variable.offset}]`)
                this.push()
                stmt.initializer.accept(this)
                this.pop("rdi")
                this.printAsmCode(`mov [rdi], rax`)
            }
        }
    }

    visitVarListStmt(stmt: VarListStmt): void {
        for (const v of stmt.varStmts) {
            this.visitVarStmt(v)
        }
    }



    // 表达式语法生成

    visitLogicalBinaryExpr(expr: LogicalBinaryExpr): void { // && 、 ||
        let n = this.sequence++;
        expr.left.accept(this)

        switch (expr.operator.lexeme) {
            case "&&":
                this.printAsmCode(`cmp rax, 0`)//判断左值是否为0
                this.printAsmCode(`je  end${n}`)//如果为0，直接跳转到 end 标签
                expr.right.accept(this)
                this.printAsmCode(`cmp rax, 0`)
                this.printAsmCode(`je  end${n}`)
                this.printAsmCode(`mov rax, 1`)

                break;
            case "||":
                this.printAsmCode(`cmp rax, 0`)//判断左值是否为0
                this.printAsmCode(`jne  end${n}`)//如果不为0，直接跳转到 end 标签
                expr.right.accept(this)
                this.printAsmCode(`cmp rax, 0`)
                this.printAsmCode(`jne  end${n}`)
                this.printAsmCode(`mov rax, 0`)

                break;
        }
        this.printLab(`end${n}:`)
    }

    visitAssignExpr(expr: AssignExpr): void {
        const left = expr.variable
        if (this.globalVars.find(v => v === left)) {//全局变量
            expr.value.accept(this)
            this.printAsmCode(`mov [${left.name}], rax`)
        } else {
            this.printAsmCode(`lea rax, [rbp ${left.offset}]`)//计算左值地址 //结果存放在 rax 寄存器
            this.push()//将变量地址压栈
            expr.value.accept(this)
            this.pop("rdi")
            this.printAsmCode(`mov  [rdi], rax`)//将计算的右值存入左值变量中 
        }
    }

    visitCommaExpr(expr: CommaExpr): void {
        expr.left.accept(this)
        expr.right.accept(this)

    }


    visitBinaryExpr(expr: BinaryExpr) {
        expr.right.accept(this)
        this.push()//将右操作数压栈
        expr.left.accept(this)//计算左操作数 //结果存放在 rax 寄存器
        this.pop("rbx")//将右操作数弹出到 rbx 寄存器
        switch (expr.operator.lexeme) {
            case "+":
                this.printAsmCode(`add rax, rbx`)
                break;
            case "-":
                this.printAsmCode(`sub rax, rbx`)
                break;
            case "*":
                this.printAsmCode(`imul rax, rbx`)
                break;
            case "/":
                this.printAsmCode(`cqo`)
                this.printAsmCode(`div rbx`)
                break;
            case ">":
                this.printAsmCode(`cmp rax, rbx`)
                this.printAsmCode(`setg al`)
                this.printAsmCode(`movzx rax, al`)
                break;
            case "<":
                this.printAsmCode(`cmp rax, rbx`)
                this.printAsmCode(`setl al`)
                this.printAsmCode(`movzx rax, al`)
                break;
            case ">=":
                this.printAsmCode(`cmp rax, rbx`)
                this.printAsmCode(`setge al`)
                this.printAsmCode(`movzx rax, al`)
                break;
            case "<=":
                this.printAsmCode(`cmp rax, rbx`)
                this.printAsmCode(`setle al`)
                this.printAsmCode(`movzx rax, al`)
                break;
            case "==":
                this.printAsmCode(`cmp rax, rbx`)
                this.printAsmCode(`sete al`)
                this.printAsmCode(`movzx rax, al`)
                break;
            case "!=":
                this.printAsmCode(`cmp rax, rbx`)
                this.printAsmCode(`setne al`)
                this.printAsmCode(`movzx rax, al`)
                break;
        }
    }

    visitUnaryExpr(expr: UnaryExpr) {
        expr.right.accept(this)
        let operator = expr.operator.lexeme
        switch (operator) {
            case "-":
                this.printAsmCode(`neg rax`)
                break;
            case "+":
                break;
            case "!"://逻辑非
                this.printAsmCode(`cmp rax, 0`)
                this.printAsmCode(`sete al`)
                this.printAsmCode(`movzx rax, al`)
                break;

        }
        if (operator == "++" || operator == "--") {//前缀自增 ++a
            let right_var = expr.right as VariableExpr
            switch (expr.operator.lexeme) {
                case "++"://前缀自增 ++a
                    this.printAsmCode(`inc rax`)
                    this.printAsmCode(`lea rdi, [rbp ${right_var.variable.offset}]`)
                    this.printAsmCode(`mov [rdi], rax`)
                    break;
                case "--":
                    this.printAsmCode(`dec rax`)
                    this.printAsmCode(`lea rdi, [rbp ${right_var.variable.offset}]`)
                    this.printAsmCode(`mov [rdi], rax`)
                    break;
            }
        }
    }

    visitSuffixSelfExpr(expr: SuffixSelfExpr): void {
        expr.left.accept(this)//计算左值 结果存放在 rax 寄存器
        let left_var = expr.left as VariableExpr
        switch (expr.operator.lexeme) {
            case "++"://后缀自增 a++
                this.printAsmCode(`mov rbx, rax`)
                this.printAsmCode(`inc rbx`)
                this.printAsmCode(`lea rdi, [rbp ${left_var.variable.offset}]`)
                this.printAsmCode(`mov [rdi], rbx`)
                break;
            case "--":
                this.printAsmCode(`mov rbx, rax`)
                this.printAsmCode(`dec rbx`)
                this.printAsmCode(`lea rdi, [rbp ${left_var.variable.offset}]`)
                this.printAsmCode(`mov [rdi], rbx`)
                break;
        }
    }

    //函数调用
    visitCallExpr(expr: CallExpr): void {
        this.printLab(``)
        this.printLab(`;函数调用 开始`)

        for (let i = expr.args.length - 1; i >= 0; i--) {
            if (i >= paramRegister.length) {
                expr.args[i].accept(this)
                this.push()
            } else {
                expr.args[i].accept(this)
                this.printAsmCode(`mov ${paramRegister[i]}, rax`)
            }
        }
        expr.callee.accept(this)//计算函数地址
        this.printAsmCode(`call rax`)//调用函数
        if (expr.args.length - paramRegister.length > 0) {
            this.printLab(`;函数参数清理`)
            this.printAsmCode(`add rsp, ${(expr.args.length - paramRegister.length) * 8}`)// 清理栈空间
        }

        this.printLab(`;函数调用 结束`)
    }


    visitVariableExpr(expr: VariableExpr): void {
        if (expr.variable.type == VarType.Fun) {//函数
            this.printAsmCode(`lea rax, [rel ${expr.variable.name}]`)
            return
        }
        if (this.globalVars.find(v => v === expr.variable)) {//全局变量 
            this.printAsmCode(`mov rax, [${expr.variable.name}]`)
        } else {
            this.printAsmCode(`lea rax, [rbp + ${expr.variable.offset}]`) //计算变量地址 //结果存放在 rax 寄存器
            this.printAsmCode(`mov rax, [rax]`) //将变量值存入 rax 寄存器 
        }
    }
    visitLiteralExpr(expr: LiteralExpr) {
        if (typeof expr.value === "number") {
            this.printAsmCode(`mov rax, ${expr.value}`)
        }
        if (typeof expr.value === "string") {
            if (expr.value.length == 1) {
                this.printAsmCode(`mov rax, ${expr.value.charCodeAt(0)}`)
            }
        }
    }

    visitGroupingExpr(expr: GroupingExpr): void {
        expr.expression.accept(this)
    }

    private push() {
        this.printAsmCode(`push rax`);
        this.stackPtr++;
    }
    private pop(reg: string) {
        this.printAsmCode(`pop ${reg}`);
        this.stackPtr--;
    }



    private program() {
        this.printLab("section .data")
        this.printAsmCode(`format db "Result: %d", 0x0a, 0`)
        this.globalVars.forEach((v) => {
            if (v.type !== VarType.Fun) {
                this.printAsmCode(`${v.name} dq 0`)//初始化全局变量
            }
        })

    }

    private main() {
        this.printLab("section .text")
        this.printAsmCode(`global main`)
        this.printAsmCode(`extern printf`)
    }

    private printLab(l: string) {
        CodeGen.codeText += `${l}\n`
        // console.log(l);
    }
    private printAsmCode(s: string) {
        CodeGen.codeText += `\t${s}\n`
        // console.log(`\t${s}`);
    }
}
