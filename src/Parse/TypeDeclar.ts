

export enum SimpleDataKind {
    Int = "int",
    Boolean = "bool",
    Void = "void",
    Char = "char",
    Null = "null",
}
//声明类型
export enum DeclarKind {
    simple = "simple",
    fun = "fun",
    class = "class",
}


export class DataType {
    kind: DeclarKind
    constructor(kind: DeclarKind) {
        this.kind = kind;
    }
}

export class SimpleType extends DataType {
    typekind: SimpleDataKind
    constructor(type: SimpleDataKind) {
        super(DeclarKind.simple)
        this.typekind = type
    }
}

export class FunType extends DataType {
    paramsType: DataType[]
    retType: DataType
    constructor(_paramsType: DataType[], _retType: DataType) {
        super(DeclarKind.fun)
        this.paramsType = _paramsType
        this.retType = _retType
    }
}

export class ClassType extends DataType {
    constructor() {
        super(DeclarKind.class)
        this.kind = DeclarKind.class; //声明类型为类
    }
}
// 