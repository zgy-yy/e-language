import { DataType } from "../Lexer/Token"

export class Var {
    type : DataType
    name: string
    constructor(name: string, type_: DataType) { 
        this.name = name
        this.type = type_
    }
}

// 变量类型  函数参数
export class ParamVar extends Var {
    constructor(name: string, type_: DataType) { 
        super(name, type_)
    }
}