import { FunLable, Var } from "../Parse/Symbol";
import { ClassType, StructType } from "../Parse/TypeDeclar";

class Env {
    level: number;
    scopeName: string;
    vars: Map<Var, string>;
    declares: Map<any, string>;
    constructor(level: number, scopeName: string) {
        this.level = level;
        this.scopeName = scopeName;
        this.vars = new Map();
        this.declares = new Map();
    }
}


export class Scope {
    level: number;
    env: Env[] = [];
    static sequence = 0;
    constructor() {
        this.level = 0;
        this.env.push(new Env(this.level, "global"));
    }
    enterScope(name: string) {
        Scope.sequence++;
        this.level++;
        this.env.push(new Env(this.level, name));
    }
    leaveScope() {
        this.level--;
        this.env.pop();
    }
    addVariable(var_: Var, name: string): string {
        let lv_name = name
        //被闭包捕获的变量
        if (var_.inClosure) {
            lv_name = '@' + lv_name
        } else if (this.level == 0) {
            lv_name = '@' + lv_name
        } else {
            lv_name = '%' + lv_name
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
    addDeclare(declare: any, name: string): string {
        if (declare instanceof StructType || declare instanceof ClassType) {
            const declareName = `struct.${this.env.at(-1).scopeName}.${declare.name}`
            this.env.at(-1).declares.set(declare, declareName);
            return declareName
        }
    }
    findDeclare(declare: any): string {
        for (let i = this.env.length - 1; i >= 0; i--) {
            if (this.env.at(i).declares.has(declare)) {
                return this.env.at(i).declares.get(declare);
            }
            const curEnv = this.env.at(i)
            for (const [key, value] of curEnv.declares.entries()) {
                if (declare instanceof StructType) {
                    if (key.name === declare.name) {
                        return value
                    }
                }
            }
        }
        return null;
    }
    get currentScope(): Env {
        return this.env.at(-1)
    }
}
