import { DataType, FunType } from "./TypeDeclar"

export class Var {
    static incremental = 0
    type: DataType //变量类型
    name: string
    _id: string
    constructor(name: string, type_: DataType) {
        this.name = name
        this.type = type_
        this._id = name + '_' + type_.toLLVM() + '_' + Var.incremental++
    }
}

// 函数变量
export class FuncVar extends Var {
    retType: DataType //返回值类型
    paramTypes: DataType[] //参数列表
    constructor(name: string, _retType: DataType, paramTypes: DataType[]) {
        const funType = new FunType(paramTypes, _retType)
        super(name, funType) //函数类型为变量类型
        this.retType = _retType //返回值类型
        this.paramTypes = paramTypes
    }
}

//声明的函数
export class FunLable extends FuncVar {
    constructor(name: string, _retType: DataType, paramTypes: DataType[]) {
        super(name, _retType, paramTypes)
    }
}