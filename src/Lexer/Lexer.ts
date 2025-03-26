/*词法分析：
    将源码中的 字符(char) 识别为 词法单元(Token)
*/

import { El } from "../El/El";
import { Token, Tokenkind, VarType } from "./Token";

export class Scanner {//扫描器，或称为词法分析
    static END = "";//以 \0 作为终止符
    source: string
    tokens: Token[]=[];
    start: number = 0; //词素中的第一个字符
    current: number = 0;//当前正在处理的字符
    line: number = 1;//跟踪current所在的行数

    static KeyWords = new Map<string, Tokenkind>([
        ["print", Tokenkind.PRINT],
        ["if", Tokenkind.IF],
        ["else", Tokenkind.ELSE],
        ["elseif", Tokenkind.ELSEIF],
        ["while", Tokenkind.WHILE],
        ["do", Tokenkind.Do],
        ["for", Tokenkind.FOR],
        ["break", Tokenkind.BREAK],
        ["continue", Tokenkind.CONTINUE],
        ["return", Tokenkind.RETURN],
        //数据类型
        [VarType.int, Tokenkind.INT],
        [VarType.char, Tokenkind.CHAR],
 
    ])


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
            case '(':
                this.addToken(Tokenkind.LEFT_PAREN);
                break;
            case ')':
                this.addToken(Tokenkind.RIGHT_PAREN);
                break;
            case "{":
                this.addToken(Tokenkind.LEFT_BRACE);
                break;
            case "}":
                this.addToken(Tokenkind.RIGHT_BRACE);
                break;
            case '+':
                this.addToken(this.match("+") ? Tokenkind.PLUS_PLUS : Tokenkind.PLUS);
                break;
            case '-':
                this.addToken(this.match("-") ? Tokenkind.MINUS_MINUS : Tokenkind.MINUS);
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
            case "&":
                this.addToken(this.match("&") ? Tokenkind.AND : Tokenkind.AND_BIT);
                break;
            case "|":
                this.addToken(this.match("|") ? Tokenkind.OR : Tokenkind.OR_BIT);
                break;  
            case "^":
                this.addToken(Tokenkind.XOR);
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
            case "'":
                this.char()
                break
            case '"':
                this.string();
                break;
            default:
            //匹配数字
                if (isDigit(c)) {
                    this.number()
                } else if(isAlpha(c)){
                    this.identifier()
                } else {
                    El.error(
                            new Token(Tokenkind.STRING, c, undefined, this.line),
                            "Unexpected character."
                        );
                    
                }

        }
    }

    //匹配标识符
    private identifier() {
        while (this.isAlphaNumeric(this.peek())) this.advance();
        const text = this.source.substring(this.start, this.current);
        let type = Scanner.KeyWords.get(text);//是否是关键字
        if(type === undefined){//不是关键字，就是标识符
            type = Tokenkind.IDENTIFIER;    
        }
        
        this.addToken(type);
    }
    isAlphaNumeric(c: string) {
        return isAlpha(c) || isDigit(c);
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

    private char() {
        while (this.peek() !== "'" && !this.isAtEnd()) {
            this.advance();
        }
        if(this.isAtEnd()){
            El.error(new Token(Tokenkind.CHARACTER, "", undefined, this.line), "Unterminated char.");
            return;
        }
        this.advance();
        const value = this.source.substring(this.start + 1, this.current - 1);
        this.addToken(Tokenkind.CHARACTER, value);
    }

    private string() {
        while (this.peek() !== '"' && !this.isAtEnd()) {
            if (this.peek() === "\n") this.line++;
            this.advance();
        }
        if (this.isAtEnd()) {
            El.error(new Token(Tokenkind.STRING, "", undefined, this.line), "Unterminated string.");
            return;
        }
        this.advance();
        const value = this.source.substring(this.start + 1, this.current - 1);
        this.addToken(Tokenkind.STRING, value);
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

function isAlpha(c: string) {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_";
}