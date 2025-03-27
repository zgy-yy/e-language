import { M } from "vite/dist/node/moduleRunnerTransport.d-CXw_Ws6P";
import { Var } from "./Symbol";


class Env{
    varEnv: Map<string, Var> = new Map<string, Var>();
}

export class SymbolTable {
    global: Var[] = [];
    local_variables: Var[] = [];
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
        if(this.level === 0){ // 全局变量
            this.global.push(var_)
        } else {
            this.local_variables.push( var_)
        }
        if (this.symTab.length === 0) {
            this.symTab.push(new Env());
        }
        this.symTab[this.symTab.length - 1].varEnv.set(name, var_);
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

    inCurrentScope(name: string): boolean {// 判断当前作用域是否有这个变量
        if (this.symTab.length === 0) {
            return false;
        }
        return this.symTab[this.symTab.length - 1].varEnv.has(name);
    }


    clearlocal(){
        this.local_variables = []
    }
    getLocal(){
        return [...this.local_variables]
    }

}