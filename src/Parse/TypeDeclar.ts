import { Expr } from "Ast/Expr";
import { Structure } from "./Symbol";


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
    struct = "struct",
    class = "class",
    array = "array",
}


export class DataType {
    kind: DataKind
    constructor(kind: DataKind) {
        this.kind = kind;
    }
    toString(): string {
        return this.kind
    }
    toLLVM(): string {
        return this.kind
    }
}

export class SimpleType extends DataType {
    simpleKind: SimpleDataKind
    constructor(kind: SimpleDataKind) {
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
    toLLVM(): string {
        return `${this.paramsType.map(item => item.toLLVM()).join('_')}_${this.retType.toLLVM()}`
    }
}

export class ArrayType extends DataType {
    elementType: DataType
    lengthExpr: Expr
    len: number
    constructor(elementType: DataType, length: Expr,len?:number) {
        super(DataKind.array)
        this.elementType = elementType
        this.lengthExpr = length
        if (len) {
            this.len = len
        }
    }
    toString(): string {
        return "arr_" + this.elementType.toString()
    }
    toLLVM(): string {
        return `arr_${this.elementType.toLLVM()}`
    }
}
export class StructType extends DataType {
    structure: Structure
    constructor(structure: Structure) {
        super(DataKind.struct)
        this.structure = structure
    }
    toString(): string {
        return `struct ${this.structure.name}`
    }
    toLLVM(): string {
        return `struct_${this.structure.name}`
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
    toLLVM(): string {
        return 'class'
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
            for (const [name, type] of structLeft.structure.fields) {
                if (!isSameType(type, structRight.structure.fields.get(name))) {
                    return false
                }
            }
            structRight.structure = structLeft.structure
            break;
        case DataKind.array:
            const arrayLeft = left as ArrayType
            const arrayRight = right as ArrayType
            //右侧元素类型为void时 代表空数组
            const arrayRightElementTypeIsVoid = arrayRight.elementType instanceof SimpleType && arrayRight.elementType.simpleKind === SimpleDataKind.Void
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