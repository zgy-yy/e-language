export enum Tokenkind{
    SEMICOLON = ';',
    LEFT_PAREN = '(',
    RIGHT_PAREN = ')',
    LEFT_BRACE = '{',
    RIGHT_BRACE = '}',
    //算术
    PLUS = "+",
    MINUS = "-",
    STAR = "*",
    SLASH = "/",
    MOD = "%",
    //位运算
    AND_BIT = "&",
    OR_BIT = "|",
    XOR = "^",
    LEFT_SHIFT = "<<",
    RIGHT_SHIFT = ">>",
    //赋值
    EQUAL = "=",
    PLUS_EQUAL = "+=",
    MINUS_EQUAL = "-=",
    STAR_EQUAL = "*=",
    SLASH_EQUAL = "/=",
    MOD_EQUAL = "%=",
    AND_EQUAL = "&=",
    OR_EQUAL = "|=",
    XOR_EQUAL = "^=",
    LEFT_SHIFT_EQUAL = "<<=",
    RIGHT_SHIFT_EQUAL = ">>=",
    //逗号
    COMMA = ",",

    //逻辑
    BANG = "!",
    AND = "&&",
    OR = "||",

    //比较
    BANG_EQUAL = "!=",
    EQUAL_EQUAL = "==",
    GREATER = ">",
    GREATER_EQUAL = ">=",
    LESS = "<",
    LESS_EQUAL = "<=",

    //literal
    IDENTIFIER = "IDENTIFIER", //标识符 例如变量名
    STRING = "STRING",
    NUMBER = "NUMBER",
    CHARACTER = "CHARACTER",
    TRUE = "TRUE",
    FALSE = "FALSE",
    NULL = "NULL",

    EOF = "EOF",
    

    //关键字
    PRINT = "Print",
    IF = "If",
    ELSE = "Else",
    ELSEIF = "ElseIf",
    WHILE = "While",
    FOR = "For",
    RETURN = "Return",



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