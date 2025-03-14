import { BinaryExpr, Expr, ExprVisitor, LiteralExpr, UnaryExpr, VariableExpr } from "../Ast/Expr";


export class CodeGen implements ExprVisitor<void>{

    static codeText: string = "";

    private stackPtr: number = 0;
    constructor(){
    }

    visitVariableExpr(expr: VariableExpr): void {
        throw new Error("Method not implemented.");
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
        this.printAsmCode(`mov rax, ${expr.value}`)
    }

    private push() {
        this.printAsmCode(`push rax`);
        this.stackPtr++;
    }
    private pop(reg: string) {
        this.printAsmCode(`pop ${reg}`);
        this.stackPtr--;
    }


    generateCode(ast: Expr): void {
        this.program()
        ast.accept(this)
        this.endProgram()

        console.log(CodeGen.codeText);
    }

    private program() { 
        this.printLab("section .data")
        this.printAsmCode(`format db "Result: % d", 0x0a, 0`)

        this.printLab("section .text")
        this.printAsmCode(`global main`)
        this.printAsmCode(`extern printf`)
        this.printLab("main:")
    }

    private endProgram() {
        this.printLab(``)
        this.printLab(`;调用 printf`)
        this.printAsmCode(`lea rdi, [rel format]`)
        this.printAsmCode(`mov rsi, rax`)//rax存放结果
        this.printAsmCode(`xor eax, eax`)//清空 eax（表示没有浮点参数）
        this.printAsmCode(`call printf wrt ..plt`)//通过 PLT 调用 printf
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
