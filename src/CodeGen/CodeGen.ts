import { AssignExpr, BinaryExpr, Expr, ExprVisitor, GroupingExpr, LiteralExpr, LogicalBinaryExpr, UnaryExpr, VariableExpr } from "../Ast/Expr";
import { BlockStmt, ExpressionStmt, IfStmt, PrintStmt, Stmt, StmtVisitor, VarStmt } from "../Ast/Stmt";
import { Var } from "../Parse/Symbol";


export class CodeGen implements ExprVisitor<void>, StmtVisitor<void> {

    static codeText: string = "";

    private sequence: number = 0;

    private stackPtr: number = 0;
    private stackSize=0;
    constructor(){
    }


    generateCode(programAst: {
        localVars: Var[];
        stmt: Stmt[];
    }): void {

        for (const value of programAst.localVars) {
            switch (value.type) {
                case "int":
                    this.stackSize += 8;
                    break;
                case "char":
                    this.stackSize += 1;
                    break;
            }
            value.offset = -1 * this.stackSize;
        }

        this.program()

        this.main()
        for (const stmt of programAst.stmt) {
            stmt.accept(this)
        }
        this.endProgram()

        console.log(CodeGen.codeText);
    }


    // 语句语法生成 
    visitIfStmt(stmt: IfStmt): void {
        let n = this.sequence++
        stmt.condition.accept(this)
        this.push()
        this.printLab(``)
        this.printLab(`;if 语句`)
        this.printAsmCode(`cmp rax, 0`)
        if(stmt.elseBranch){
            this.printAsmCode(`je  else${n}`)
        }else{
            this.printAsmCode(`je  end${n}`)
        }

        stmt.thenBranch.accept(this)
        this.printAsmCode(`jmp end${n}`)
        if(stmt.elseBranch){
            this.printLab(`else${n}:`)
            stmt.elseBranch.accept(this)
        }
        this.printLab(`end${n}:`)
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
        // this.printAsmCode(`lea rax, [rbp ${stmt.variable.offset}]`)
        // this.printAsmCode(`mov rax, [rax]`)
        if (stmt.initializer) {
            this.printAsmCode(`lea rax, [rbp ${stmt.variable.offset}]`)
            this.push()
            stmt.initializer.accept(this)
            this.pop("rdi")
            this.printAsmCode(`mov [rdi], rax`)
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
        this.printAsmCode(`lea rax, [rbp+${left.offset}]`)//计算左值地址 //结果存放在 rax 寄存器
        this.push()//将变量地址压栈
        expr.value.accept(this)
        this.pop("rdi")
        this.printAsmCode(`mov  [rdi], rax`)//将计算的右值存入左值变量中

    }

    visitVariableExpr(expr: VariableExpr): void {
        this.printAsmCode(`lea rax, [rbp ${expr.variable.offset}]`) //计算变量地址 //结果存放在 rax 寄存器
        this.printAsmCode(`mov rax, [rax]`) //将变量值存入 rax 寄存器
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
        switch (expr.operator.lexeme) {
            case "-":
                this.printAsmCode(`neg rax`)
                break;
            case "+":
                break;
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
        this.printAsmCode(`format db "Result: % d", 0x0a, 0`)
    }

    private main() {
        this.printLab("section .text")
        this.printAsmCode(`global main`)
        this.printAsmCode(`extern printf`)
        this.printLab("main:")
        this.printAsmCode(`push rbp`)
        this.printAsmCode(`mov rbp, rsp`)
        this.printAsmCode(`sub rsp, ${this.stackSize}`)//分配栈空间
    }

    private endProgram() {
        this.printLab(``)
        this.printLab(`;退出程序`)
        this.printAsmCode(`mov eax, 60`)//sys_exit
        this.printAsmCode(`xor edi, edi`)//返回值
        this.printAsmCode(`syscall`)
        
        this.printLab(`section .note.GNU-stack noalloc noexec nowrite progbits`)
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
