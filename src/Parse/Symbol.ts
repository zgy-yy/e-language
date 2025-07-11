import { DataType } from "../Lexer/Token"

export class Var {
    static incremental = 0
    type: DataType //变量类型
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

export class FuncVar extends Var {
    retType: DataType //返回值类型
    params: Var[] //参数列表
    constructor(name: string, _retType: DataType, params: Var[]) {
        super(name, DataType.Fun) //函数类型为变量类型
        this.retType = _retType //返回值类型
        this.params = params
    }
}