import { Var } from "Parse/Symbol";

class Env {
    level: number;
    vars: Map<Var, string>;
    constructor(level: number) {
        this.level = level;
        this.vars = new Map();
    }
}


export class Scope {
    level: number;
    env: Env[] = [];
    static sequence = 0;
    constructor() {
        this.level = 0;
        this.env.push(new Env(this.level));
    }
    enterScope() {
        Scope.sequence++;
        this.level++;
        this.env.push(new Env(this.level));
    }
    leaveScope() {
        this.level--;
        this.env.pop();
    }
    addVariable(var_: Var, name: string): string {
        let lv_name = name + '_' + Scope.sequence
        if (this.level == 0) {
            lv_name = '@' + lv_name
        } else {
            lv_name = '%' + lv_name
        }
        if (name === "@main") {
            lv_name = name
        }
        this.env.at(-1).vars.set(var_, lv_name);
        return lv_name;
    }
    findVariable(var_: Var): string {
        for (let i = this.env.length - 1; i >= 0; i--) {
            if (this.env.at(i).vars.has(var_)) {
                return this.env.at(i).vars.get(var_);
            }
        }
        return null;
    }
}
