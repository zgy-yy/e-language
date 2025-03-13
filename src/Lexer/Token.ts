export enum Tokenkind{
    SEMICOLON = ';',
    //算术
    PLUS = "+",
    MINUS = "-",
    STAR = "*",
    SLASH = "/",
    //逻辑
    BANG = "!",
    AND = "&&",
    OR = "||",

    //比较
    EQUAL = "=",
    BANG_EQUAL = "!=",
    EQUAL_EQUAL = "==",
    GREATER = ">",
    GREATER_EQUAL = ">=",
    LESS = "<",
    LESS_EQUAL = "<=",

    //literal
    STRING = "string",
    NUMBER = "number",

    EOF ="EOF"
}

export class Token{
    type: Tokenkind
    lexeme: string; //词素：一组字符的集合 （关键字的组成字符）
    literal: any;//字面量：数值或字符串、null
    line: number;//位置信息
    constructor(
        type: Tokenkind,
        lexeme: string,
        literal: any,
        line: number
    ) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }

    toString() {
        return `${this.type} ${this.lexeme} ${this.literal}`;
    }
}