import { BinaryExpr, Expr, LiteralExpr, UnaryExpr } from "../Ast/Expr";
import { El } from "../El/El";
import { Token, Tokenkind } from "../Lexer/Token";

export class Parser {
    tokens: Token[]
    current: number = 0;//tokens 游标
    constructor(tokens: Token[]) {
        this.tokens = tokens
    }

    parse() {
        const statements = [];//语句
        while (!this.isAtEnd()) {
            statements.push(this.expression())
        }
        return statements
    }

    expression(): Expr {//表达式
        return this.equality()
    }
    equality() {//等于 ｜ 不等 表达式
        let expr = this.comparison()
        while (this.match(Tokenkind.EQUAL_EQUAL, Tokenkind.BANG_EQUAL)) {
            const operator = this.previous()
            const right = this.comparison()
            expr = new BinaryExpr(expr, operator, right)
        }
        return expr
    }
    comparison() {//比较表达式
        let expr = this.term()
        while (this.match(Tokenkind.GREATER, Tokenkind.GREATER_EQUAL, Tokenkind.LESS, Tokenkind.LESS_EQUAL)) {
            const operator = this.previous()
            const right = this.term()
            expr = new BinaryExpr(expr, operator, right)
        }
        return expr
    
    }
    term() {//+ - 运算 表达式
        let expr = this.factor()//加减运算的优先级 小于 乘除运算；所以加减运算的左操作数是乘除表达式
        while (this.match(Tokenkind.PLUS, Tokenkind.MINUS)) {
            const operator = this.previous();
            const right = this.factor()
            expr = new BinaryExpr(expr,operator,right)
        }
        return expr
    }
    factor(){// * / 运算 表达式
        let expr = this.primary()//左操作数
        while (this.match(Tokenkind.SLASH, Tokenkind.STAR)) {//match会使得 游标前进一步
            const operator = this.previous()//操作符
            const right = this.primary()
            expr = new BinaryExpr(expr,operator,right)
        }
        return expr
    }
    unary() {//一元表达式
        if (this.match(Tokenkind.BANG, Tokenkind.MINUS)) {
            const operator = this.previous()
            const right = this.unary()
            return new UnaryExpr(operator, right)
        }
        return this.primary()
    }

    primary(): Expr { //住表达式 =>字面量，this  boolean 标识符
        if (this.match(Tokenkind.NUMBER, Tokenkind.STRING)) {
            return new LiteralExpr(this.previous().literal); //字面量 表达式
        }
        throw this.error(this.peek(), "Expect expression.");
    }





    //工具
    match(...kinds: Tokenkind[]) {//匹配到 TokenKind时，当前token 应该被消费，游标前进
        for (const kind of kinds) {
            if (this.check(kind)) {
                this.advance()
                return true
            }
        }
        return false
    }

    private advance() {
        if (!this.isAtEnd()) {
            this.current++
        }
        return this.previous()
    }

    private check(kind: Tokenkind) {
        if (this.isAtEnd()) {
            return false
        }
        return this.peek().type == kind
    }
    private isAtEnd() {
        return this.peek().type == Tokenkind.EOF
    }
    private peek(): Token {
        return this.tokens[this.current]
    }
    private previous() {//上一个token
        return this.tokens[this.current - 1];
    }


    // 错误同步
    consume(kind :Tokenkind, message: string) {//消费当前token，如果不是kind类型的token，抛出异常
        if (this.check(kind)) {
            return this.advance()
        }
        throw this.error(this.peek(), "Expect " + kind)
    }
    private error(token: Token, message: string) {
        El.error(token, message)
        return new ParseError("Parser error." + message);
    }
    synchronize() {
        this.advance()
        while (!this.isAtEnd()) {
            if (this.previous().type == Tokenkind.SEMICOLON) {
                return
            }
            switch (this.peek().type) {
                // case Tokenkind.CLASS:
                // case Tokenkind.FUN:
                // case Tokenkind.VAR:
                // case Tokenkind.FOR:
                // case Tokenkind.IF:
                // case Tokenkind.WHILE:
                // case Tokenkind.PRINT:
                // case Tokenkind.RETURN:
                    // return
            }
            this.advance()
        }
    }

    

}

export class ParseError extends Error { }