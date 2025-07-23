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
        case DataKind.struct:
            const structType1 = type1 as StructType
            const structType2 = type2 as StructType
            // 根据结构体字段匹配
            if (structType1.structure.fields.length !== structType2.structure.fields.length) {
                return false
            }
            //结构体名
            const structName = structType1.structure.name ? structType1.structure.name : structType2.structure.name

          
            for (let i = 0; i < structType1.structure.fields.length; i++) {
                if (!isSameType(structType1.structure.fields[i].type, 
                    structType2.structure.fields.find(f => f.name === structType1.structure.fields[i].name)?.type)) {
                    return false
                }
            }
            structType1.structure.name = structName
            structType2.structure.name = structName

            break;
        case DataKind.class:
            return false
        // return type1.className === type2.className
    }
    return true;
}