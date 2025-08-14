
export enum SimpleKind {
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
    struct = "struct",
    array = "array",
    class = "class",
}


export class DataType {
    kind: DataKind
    constructor(kind: DataKind) {
        this.kind = kind;
    }
    toString(): string {
        return this.kind
    }
}

export class SimpleType extends DataType {
    simpleKind: SimpleKind
    constructor(kind: SimpleKind) {
        super(DataKind.simple)
        this.simpleKind = kind
    }
    toString(): string {
        return this.simpleKind
    }
    toLLVM(): string {
        return this.simpleKind
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
    toString(): string {
        return `(${this.paramsType.map(item => item.toString()).join('_')})->${this.retType.toString()}`
    }
}

export class ArrayType extends DataType {
    elementType: DataType
    len: number
    constructor(elementType: DataType, length: number) {
        super(DataKind.array)
        this.elementType = elementType
        this.len = length
    }
    toString(): string {
        return "arr_" + this.elementType.toString()
    }
}


export class StructType extends DataType {
    name: string
    fields: Map<string, DataType>
    constructor(name: string, fields: Map<string, DataType>) {
        super(DataKind.struct)
        this.name = name
        this.fields = fields
    }
    toString(): string {
        return `struct ${this.name}`
    }
}

export class ClassType extends DataType {
    constructor() {
        super(DataKind.class)
        this.kind = DataKind.class; //声明类型为类
    }
    toString(): string {
        return super.toString() + 'class'
    }
}
// 


export function isSameType(left: DataType, right: DataType): boolean {
    // 如果类型为空，直接返回 false
    if (!left || !right) {
        return false
    }
    const leftKind = left.kind
    const rightKind = right.kind
    // 类型不一致，直接返回 false
    if (leftKind !== rightKind) {
        return false
    }
    // 类型一致，继续判断具体类型
    switch (leftKind) {
        case DataKind.simple:
            const simpleLeft = left as SimpleType
            const simpleRight = right as SimpleType
            if (simpleLeft.simpleKind !== simpleRight.simpleKind) {
                return false
            }
            break;
        case DataKind.fun:
            const funLeft = left as FunType
            const funRight = right as FunType
            // 返回值类型不一致，直接返回 false
            if (!isSameType(funLeft.retType, funRight.retType)) {
                return false
            }
            // 参数类型数量不一致，直接返回 false
            if (funLeft.paramsType.length !== funRight.paramsType.length) {
                return false
            }
            // 参数类型不一致，直接返回 false
            for (let i = 0; i < funLeft.paramsType.length; i++) {
                if (!isSameType(funLeft.paramsType[i], funRight.paramsType[i])) {
                    return false
                }
            }
            break;
        case DataKind.struct:
            const structLeft = left as StructType
            const structRight = right as StructType
            for (const [name, type] of structLeft.fields) {
                if (!isSameType(type, structRight.fields.get(name))) {
                    return false
                }
            }
            break;
        case DataKind.array:
            const arrayLeft = left as ArrayType
            const arrayRight = right as ArrayType
            //右侧元素类型为void时 代表空数组
            const arrayRightElementTypeIsVoid = arrayRight.elementType instanceof SimpleType && arrayRight.elementType.simpleKind === SimpleKind.Void
            if (!isSameType(arrayLeft.elementType, arrayRight.elementType) && !arrayRightElementTypeIsVoid) {
                return false
            }
            break;
        case DataKind.class:
            return false
        // return type1.className === type2.className
    }
    return true;
}