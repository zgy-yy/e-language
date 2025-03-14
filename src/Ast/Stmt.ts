/*
* 语句节点
*/

import { Token } from "../Lexer/Token";
import { Expr } from "./Expr";



export interface StmtVisitor<R> {

    visitExpressionStmt(stmt: ExpressionStmt): R;

    visitPrintStmt(stmt: PrintStmt): R;//暂时增加输出语句代替打印

    visitVarStmt(stmt: VarStmt): R;
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
    name: Token;
    initializer?: Expr;
    constructor(name: Token, initializer?: Expr) {
        this.name = name;
        this.initializer = initializer;
    }
    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitVarStmt(this);
    }
}