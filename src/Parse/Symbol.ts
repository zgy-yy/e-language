import { DataType } from "../Lexer/Token"

export class Var {
    static incremental = 0
    type: DataType
    name: string
    _id: string
    constructor(name: string, type_: DataType) {
        this.name = name
        this.type = type_
        this._id = name + '_' + type_ + '_' + Var.incremental++
    }
}

// 变量类型  函数参数
export class ParamVar extends Var {
    constructor(name: string, type_: DataType) {
        super(name, type_)
    }
}