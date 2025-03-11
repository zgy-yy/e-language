/*词法分析：
    将源码中的 字符(char) 识别为 词法单元(Token)
*/

import { Token, Tokenkind } from "./Token";

export class Scanner {//扫描器，或称为词法分析
    static END = "";//以 \0 作为终止符
    source: string
    tokens: Token[]=[];
    start: number = 0; //词素中的第一个字符
    current: number = 0;//当前正在处理的字符
    line: number = 1;//跟踪current所在的行数
    constructor(source: string) {
        this.source = source
    }

    public scanTokens(): Token[]{
        while (!this.isAtEnd()) {
            this.start = this.current
            this.scanToken()
        }
        this.tokens.push(new Token(Tokenkind.EOF,"",undefined,this.line))
        return this.tokens
    }
    private scanToken() { //扫描出Token
        const c = this.advance();//或许当前字符，准备消费；current+1
        // console.log('c->',c)
        switch (c) {
            case '+':
                this.addToken(Tokenkind.PLUS);
                break;
            case '-':
                this.addToken(Tokenkind.MINUS)
                break;
            case '*':
                this.addToken(Tokenkind.STAR)
                break;
            case '/': // todo 注释符
                this.addToken(Tokenkind.SLASH)
                break
            case ';':
                this.addToken(Tokenkind.SEMICOLON)
                break
            case "!":
                this.addToken(this.match("=") ? Tokenkind.BANG_EQUAL : Tokenkind.BANG);
                break;
            case "=":
                this.addToken(
                    this.match("=") ? Tokenkind.EQUAL_EQUAL : Tokenkind.EQUAL
                );
                break;
            case "<":
                this.addToken(this.match("=") ? Tokenkind.LESS_EQUAL : Tokenkind.LESS);
                break;
            case ">":
                this.addToken(
                    this.match("=") ? Tokenkind.GREATER_EQUAL : Tokenkind.GREATER
                );
            case " ":
            case "\r":
            case "\t":
                // 忽略空格
                break;
            case "\n":
                this.line++;
                break;
            default:
            //匹配数字
                if (isDigit(c)) {
                    this.number()
                }

        }
    }
    

    private isAtEnd() {//判断源码是否结束，已经消费完所有的字符
        return this.current >= this.source.length;
    }

    private advance() {//返回当前的字符，并向前移动一个字符
        return this.source.charAt(this.current++)
    }
    private addToken(tokenType: Tokenkind): void;
    private addToken(tokenType: Tokenkind, literal: any): void;
    private addToken(tokenType: Tokenkind, literal?: any): void{
        const lexeme = this.source.substring(this.start, this.current);
        const token = new Token(tokenType, lexeme, literal, this.line)
        this.tokens.push(token)
    }
    private peek() {//前瞻，只返回当前字符，而不消费
        if (this.isAtEnd()) return Scanner.END;
        return this.source.charAt(this.current);
    }
   private peekNext() {
        if (this.current + 1 >= this.source.length) return Scanner.END;
        return this.source.charAt(this.current + 1);
    }
    //匹配当前字符，如果匹配成功，current+1
    private  match(expected: string): boolean {
        if (this.isAtEnd()) return false;
        if (this.source.charAt(this.current) !== expected) return false;
        this.current++;
        return true;
    }

    private number() {
        while (isDigit(this.peek())) {
            this.advance()
        }
        // Look for a fractional part.
        if (this.peek() === "." && isDigit(this.peekNext())) {
            // Consume the "."
            this.advance();

            while (isDigit(this.peek())) {
                this.advance();
            }
        } 
        const literal = this.source.substring(this.start, this.current)
        this.addToken(Tokenkind.NUMBER, Number(literal))
    }
}

function isDigit(c: string) {
    return c >= "0" && c <= "9";
}