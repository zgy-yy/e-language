import { BinaryExpr, Expr, LiteralExpr } from "../Ast/Expr";
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
        return this.term();
    }

    term() {//+ - 运算
        let expr = this.factor()//加减运算的优先级 小于 乘除运算；所以 
        while (this.match(Tokenkind.PLUS, Tokenkind.MINUS)) {
            const operator = this.previous();
            const right = this.factor()
            expr = new BinaryExpr(expr,operator,right)
        }
        return expr
    }
    factor(){// * / 运算
        let expr = this.primary()//左操作数
        while (this.match(Tokenkind.SLASH, Tokenkind.STAR)) {//match会使得 游标前进一步
            const operator = this.previous()//操作符
            const right = this.primary()
            expr = new BinaryExpr(expr,operator,right)
        }
        return expr
    }

    primary(): Expr { //字面量，this  boolean 标识符
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

    private error(token: Token, message: string) {
        console.warn(token)
        return new ParseError("Parser error."+message);
    }

}

export class ParseError extends Error { }