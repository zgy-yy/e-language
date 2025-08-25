import { Var } from "./Symbol";
import { DataType, isSameType, StructType } from "./TypeDeclar";


class Env {
    level: number;
    varEnv: Map<string, Var> = new Map<string, Var>();
    structEnv: Map<string, StructType> = new Map<string, StructType>();
    constructor(level: number) {
        this.level = level;
    }
}
export class SymbolTable {
    currentLevel: number = 0;
    private symTab: Env[] = [];

    constructor() {
        this.symTab.push(new Env(0));
    }

    enterScope() {
        this.currentLevel++;
        this.symTab.push(new Env(this.currentLevel));
    }
    leaveScope() {
        this.currentLevel--;
        this.symTab.pop();
    }


    addVariable(name: string, var_: Var) {
        this.symTab.at(-1).varEnv.set(name, var_);
        return var_;
    }

    findVariable(name: string): Var {// 从当前作用域开始查找
        const inCurScope =this.varInCurrentScope(name)
        if(inCurScope){
            return this.symTab.at(-1).varEnv.get(name)
        }
        for (let i = this.symTab.length - 1; i >= 0; i--) {
            if (this.symTab[i].varEnv.has(name)) {
                const var_ = this.symTab[i].varEnv.get(name)
                if (i !== 0) {
                    var_.inClosure = true // 非全局变量，在闭包中,捕获变量
                }
                return var_
            }
        }
        return null;
    }

    varInCurrentScope(name: string): boolean {// 判断当前作用域是否有这个变量
        if (this.symTab.length === 0) {
            return false;
        }
        return this.symTab[this.symTab.length - 1].varEnv.has(name);
    }

    addStructure(name: string, structure: StructType) {
        this.symTab.at(-1).structEnv.set(name, structure)
        return structure;
    }

    findStructure(name: string): StructType {
        for (let i = this.symTab.length - 1; i >= 0; i--) {
            if (this.symTab[i].structEnv.has(name)) {
                return this.symTab[i].structEnv.get(name);
            }
        }
        return null;
    }
    finddStructure(struct: { name: string, val_type: DataType }[]): StructType {
        let structType = null
        for (let i = this.symTab.length - 1; i >= 0; i--) {
            this.symTab[i].structEnv.forEach((value, key) => {
                for (let j = 0; j < struct.length; j++) {
                    const name = struct[j].name
                    const val_type = struct[j].val_type
                    if (value.fields.find(f => f.field === name)) {
                        if (!isSameType(value.fields.find(f => f.field === name).type, val_type)) {
                            return
                        }
                    } else {
                        return
                    }
                }
                structType = value
            })
        }
        return structType;
    }


    structInCurrentScope(name: string): boolean {// 判断当前作用域是否有这个结构体
        if (this.symTab.length === 0) {
            return false;
        }
        return this.symTab.at(-1).structEnv.has(name);
    }
}