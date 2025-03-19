export enum Tokenkind{
    SEMICOLON = ';',
    LEFT_PAREN = '(',
    RIGHT_PAREN = ')',
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
    IDENTIFIER = "IDENTIFIER",
    STRING = "STRING",
    NUMBER = "NUMBER",
    CHARACTER = "CHARACTER",

    EOF = "EOF",
    

    //关键字
    PRINT = "Print",



    //数据类型
    INT = "Int",
    BOOLEAN = "Boolean",
    VOID = "Void",
    CHAR = "Char",
}

//变量类型
export enum VarType{
    int = "int",
    boolean = "boolean",
    void = "void",
    char = "char",
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