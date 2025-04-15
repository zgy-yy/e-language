import { VarType } from "../Lexer/Token"

export class Var {
    type : VarType
    name: string
    offset : number = 0
    constructor(name: string, type_: VarType) { 
        this.name = name
        this.type = type_
    }
}

// 变量类型  函数参数
export class ParamVar extends Var {
    constructor(name: string, type_: VarType) { 
        super(name, type_)
    }
}