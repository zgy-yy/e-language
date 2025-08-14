import { Expr } from "Ast/Expr";
import { Var } from "./Symbol";
import { DataType, isSameType, StructType } from "./TypeDeclar";


class Env {
    varEnv: Map<string, Var> = new Map<string, Var>();
    structEnv: Map<string, StructType> = new Map<string, StructType>();
}
export class SymbolTable {
    global: Env = new Env();
    private level: number = 0;
    private symTab: Env[] = [];

    enterScope() {
        this.level++;
        this.symTab.push(new Env());
    }
    leaveScope() {
        this.level--;
        this.symTab.pop();
    }


    addVariable(name: string, var_: Var) {
        if (this.level === 0) { // 全局变量
            this.global.varEnv.set(name, var_)
        }
        if (this.symTab.length === 0) {
            this.symTab.push(new Env());
        }
        this.symTab.at(-1).varEnv.set(name, var_);
        return var_;
    }

    findVariable(name: string): Var {// 从当前作用域开始查找
        for (let i = this.symTab.length - 1; i >= 0; i--) {
            if (this.symTab[i].varEnv.has(name)) {
                return this.symTab[i].varEnv.get(name);
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
        if (this.level === 0) {
            this.global.structEnv.set(name, structure)
        }
        if (this.symTab.length === 0) {
            this.symTab.push(new Env());
        }
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
                    if (value.fields.has(name)) {
                        if (!isSameType(value.fields.get(name), val_type)) {
                            return
                        }
                    }else{
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