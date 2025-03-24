/*
* 语句节点
*/

import { Token } from "../Lexer/Token";
import { Var } from "../Parse/Symbol";
import { Expr } from "./Expr";



export interface StmtVisitor<R> {

    visitExpressionStmt(stmt: ExpressionStmt): R;

    visitPrintStmt(stmt: PrintStmt): R;//暂时增加输出语句代替打印

    visitVarStmt(stmt: VarStmt): R;
    visitBlockStmt(stmt: BlockStmt): R;
}

export interface Stmt {

    accept<R>(visitor: StmtVisitor<R>): R;

}



export class ExpressionStmt implements Stmt {
    expression: Expr;
    constructor(expression: Expr) {
        this.expression = expression;
    }

    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitExpressionStmt(this);
    }

}

export class PrintStmt implements Stmt {
    expression: Expr;
    constructor(expression: Expr) {
        this.expression = expression;
    }

    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitPrintStmt(this);
    }
}


export class VarStmt implements Stmt {
    variable: Var;
    initializer?: Expr;
    constructor(var_: Var, initializer?: Expr) {
        this.variable = var_;
        this.initializer = initializer;
    }
    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitVarStmt(this);
    }
}

export class BlockStmt implements Stmt {

    statements: Array<Stmt>;

    constructor(statements: Array<Stmt>) {

        this.statements = statements;

    }
    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitBlockStmt(this);
    }
}