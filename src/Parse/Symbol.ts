import { VarType } from "../Lexer/Token"

export class Var {
    type : VarType
    name: string
    offset : number = 0
    constructor(name: string, type_: VarType) { 
        this.name = name
        this.type = type_
    }
}
