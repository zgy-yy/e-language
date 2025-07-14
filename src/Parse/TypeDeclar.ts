

export enum SimpleDataKind {
    Int = "int",
    Boolean = "bool",
    Void = "void",
    Char = "char",
    Null = "null",
}
//声明类型
export enum DataKind {
    simple = "simple",
    fun = "fun",
    class = "class",
}


export class DataType {
    kind: DataKind
    constructor(kind: DataKind) {
        this.kind = kind;
    }
}

export class SimpleType extends DataType {
    simpleKind: SimpleDataKind
    constructor(kind: SimpleDataKind) {
        super(DataKind.simple)
        this.simpleKind = kind
    }
}

export class FunType extends DataType {
    paramsType: DataType[]
    retType: DataType
    constructor(_paramsType: DataType[], _retType: DataType) {
        super(DataKind.fun)
        this.paramsType = _paramsType
        this.retType = _retType
    }
}

export class ClassType extends DataType {
    constructor() {
        super(DataKind.class)
        this.kind = DataKind.class; //声明类型为类
    }
}
// 


export function isSameType(type1: DataType, type2: DataType): boolean {
    // 如果类型为空，直接返回 false
    if (!type1 || !type2) {
        return false
    }
    const type1Kind = type1.kind
    const type2Kind = type2.kind
    // 类型不一致，直接返回 false
    if (type1Kind !== type2Kind) {
        return false
    }
    // 类型一致，继续判断具体类型
    switch (type1Kind) {
        case DataKind.simple:
            const simpleType1 = type1 as SimpleType
            const simpleType2 = type2 as SimpleType
            if (simpleType1.simpleKind !== simpleType2.simpleKind) {
                return false
            }
            break;
        case DataKind.fun:
            const funType1 = type1 as FunType
            const funType2 = type2 as FunType
            // 返回值类型不一致，直接返回 false
            if (!isSameType(funType1.retType, funType2.retType)) {
                return false
            }
            // 参数类型数量不一致，直接返回 false
            if (funType1.paramsType.length !== funType2.paramsType.length) {
                return false
            }
            // 参数类型不一致，直接返回 false
            for (let i = 0; i < funType1.paramsType.length; i++) {
                if (!isSameType(funType1.paramsType[i], funType2.paramsType[i])) {
                    return false
                }
            }
            break;
        case DataKind.class:
            return false
        // return type1.className === type2.className
    }
    return true;
}