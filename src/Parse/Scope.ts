import { M } from "vite/dist/node/moduleRunnerTransport.d-CXw_Ws6P";
import { Var } from "./Symbol";


class Env{
    varEnv: Map<string, Var> = new Map<string, Var>();
}

export class SymbolTable {
    variables: Map<string, Var> = new Map<string,Var>  ()
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
        if (this.symTab.length === 0) {
            this.symTab.push(new Env());
        }
        this.symTab[this.symTab.length - 1].varEnv.set(name, var_);
        return var_;
    }

    findVariable(name: string): Var {
        for (let i = this.symTab.length - 1; i >= 0; i--) {
            if (this.symTab[i].varEnv.has(name)) {
                return this.symTab[i].varEnv.get(name);
            }
        }
        return null;
    }




}