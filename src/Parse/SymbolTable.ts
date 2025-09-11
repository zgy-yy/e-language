import { FunLable, Var } from "./Symbol";
import { DataType, isSameType, StructType } from "./TypeDeclar";

export enum ScopeType {
    Global = "global",
    Function = "function",
    Block = "block",
    For = "for",
}
class Env {
    level: number;
    scopeType: ScopeType;
    varEnv: Map<string, Var> = new Map<string, Var>();
    structDeclareEnv: Map<string, StructType> = new Map<string, StructType>();
    funDeclareEnv: Map<string, FunLable> = new Map<string, FunLable>();
    constructor(level: number, scopeType: ScopeType) {
        this.level = level;
        this.scopeType = scopeType;
    }
}
export class SymbolTable {
    currentLevel: number = 0;
    private symTab: Env[] = [];

    constructor() {
        this.symTab.push(new Env(0, ScopeType.Global));
    }

    enterScope(scopeType: ScopeType) {
        this.currentLevel++;
        this.symTab.push(new Env(this.currentLevel, scopeType));
    }
    leaveScope() {
        this.currentLevel--;
        this.symTab.pop();
    }


    addIdentifier(name: string, idne: Var|FunLable) {
        if(idne instanceof Var){
            this.symTab.at(-1).varEnv.set(name, idne);
        }else{
            this.symTab.at(-1).funDeclareEnv.set(name, idne);
        }

        return idne;
    }

    findIdentifier(name: string): Var|FunLable {// 从当前作用域开始查找
        const inCurScope =this.identifierInCurrentScope(name)
        if(inCurScope){
            return this.symTab.at(-1).varEnv.get(name)||this.symTab.at(-1).funDeclareEnv.get(name)
        }
        let  crossFunc = false
        for (let i = this.symTab.length - 1; i >= 0; i--) {
            const curEnv = this.symTab[i]
            if (curEnv.varEnv.has(name)||curEnv.funDeclareEnv.has(name)) {
                const idne = curEnv.varEnv.get(name) || curEnv.funDeclareEnv.get(name)
                if(crossFunc){
                    if(idne instanceof Var){
                        idne.inClosure = true // 非全局变量，在闭包中,捕获变量
                    }
                }
                return idne
            }
            if(curEnv.scopeType === ScopeType.Function){
                crossFunc = true
            }
        }
        return null;
    }

    identifierInCurrentScope(name: string): boolean {// 判断当前作用域是否有这个变量
        if (this.symTab.length === 0) {
            return false;
        }
        return this.symTab[this.symTab.length - 1].varEnv.has(name)||this.symTab[this.symTab.length - 1].funDeclareEnv.has(name)
    }

    addStructure(name: string, structure: StructType) {
        this.symTab.at(-1).structDeclareEnv.set(name, structure)
        return structure;
    }

    findStructure(name: string): StructType {
        for (let i = this.symTab.length - 1; i >= 0; i--) {
            if (this.symTab[i].structDeclareEnv.has(name)) {
                return this.symTab[i].structDeclareEnv.get(name);
            }
        }
        return null;
    }


    structInCurrentScope(name: string): boolean {// 判断当前作用域是否有这个结构体
        if (this.symTab.length === 0) {
            return false;
        }
        return this.symTab.at(-1).structDeclareEnv.has(name);
    }
}