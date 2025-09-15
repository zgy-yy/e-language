
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
    tuple = "tuple",
    array = "array",
    class = "class",
    ptr = "ptr",
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
        return `(${this.paramsType.map(item => item.toString()).join(',')})->${this.retType.toString()}`
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
        return `[${this.len}]${this.elementType.toString()}`
    }
}


export class StructType extends DataType {
    name: string
    fields: { field: string, type: DataType }[]
    constructor(name: string, fields: { field: string, type: DataType }[]) {
        super(DataKind.struct)
        this.name = name
        this.fields = fields.sort((a, b) => a.field.localeCompare(b.field))
    }
    toString(): string {
        return `struct ${this.name}`
    }
}

export class TupleType extends DataType {
    elementsType: DataType[]
    constructor(elements: DataType[]) {
        super(DataKind.tuple)
        this.elementsType = elements
    }
    toString(): string {
        return `[${this.elementsType.map(item => item.toString()).join(',')}]`
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


export class PtrType extends DataType {
    elementType: DataType
    constructor(elementType: DataType) {
        super(DataKind.ptr)
        this.elementType = elementType
    }
    toString(): string {
        return `${this.elementType.toString()}@`
    }
}

// 


export function isSameType(left: DataType, right: DataType): boolean {

    if (!left && !right) {
        return true
    }

    if (left instanceof PtrType || right instanceof PtrType) {
        if (left instanceof PtrType && right instanceof PtrType) {
            return isSameType(left.elementType, right.elementType)
        }
        if (left instanceof PtrType) {
            return isSameType(left.elementType, right)
        }
        if (right instanceof PtrType) {
            return isSameType(left, right.elementType)
        }
    }

    const leftKind = left.kind
    const rightKind = right.kind
    // 类型不一致，直接返回 false
    // console.log(9628,leftKind, rightKind)
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

            if (structLeft !== structRight && structRight.name !== 'anonymous') {
                console.log(structLeft, structRight)
                return false
            }
            for (let i = 0; i < structLeft.fields.length; i++) {
                const curfield = structLeft.fields[i]
                const curfieldRight = structRight.fields.find(f => f.field === curfield.field)
                if (!curfieldRight) {
                    return false
                }
                if (!isSameType(curfield.type, curfieldRight.type)) {
                    return false
                }
            }
            if (structRight.name === 'anonymous') {
                structRight.name = structLeft.name
            }
            break;
        case DataKind.array:
            const arrayLeft = left as ArrayType
            const arrayRight = right as ArrayType
            // console.log(9627,arrayLeft, arrayRight)
            
            //右侧元素类型为void时 代表空数组
            if (arrayLeft.len !== arrayRight.len) {
                return false
            }
            if(arrayLeft.len===0){
                return true
            }
            if (!isSameType(arrayLeft.elementType, arrayRight.elementType)) {
                return false
            }
            break;
        case DataKind.class:
            return false
        // return type1.className === type2.className
    }
    return true;
}