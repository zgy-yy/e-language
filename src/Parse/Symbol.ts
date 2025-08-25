import { ArrayType, DataType, FunType, StructType } from "./TypeDeclar"

export class Var {
    inClosure: boolean = false
    type: DataType //变量类型
    name: string
    constructor(name: string, type_: DataType) {
        this.name = name
        this.type = type_
    }
    toString(): string {
        return this.name
    }
}

// 函数变量
export class FuncVar extends Var {
    retType: DataType //返回值类型
    paramTypes: DataType[] //参数列表
    constructor(name: string, funType: FunType) {
        super(name, funType) //函数类型为变量类型
        this.retType = funType.retType //返回值类型
        this.paramTypes = funType.paramsType
    }
}

//声明的函数
export class FunLable extends FuncVar {
    closureEnv: Var[]
    constructor(name: string, funType: FunType) {
        super(name, funType)
    }
    addEnvVar(envVar: Var) {
        this.closureEnv.push(envVar)
    }
}

export class StructVar extends Var {
    fields: { field: string, type: DataType }[]
    constructor(name: string, type_: DataType, fields: { field: string, type: DataType }[]) {
        super(name, type_)
        this.fields = fields.sort((a, b) => a.field.localeCompare(b.field))
    }
}

export class ArrayVar extends Var {
    elementType: DataType
    constructor(name: string, arrayType: ArrayType) {
        super(name, arrayType)
        this.elementType = arrayType.elementType
    }
}
