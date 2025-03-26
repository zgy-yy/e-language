/*
* 语句节点
*/

import { Token, VarType } from "../Lexer/Token";
import { Var } from "../Parse/Symbol";
import { Expr } from "./Expr";



export interface StmtVisitor<R> {

    visitExpressionStmt(stmt: ExpressionStmt): R;

    visitPrintStmt(stmt: PrintStmt): R;//暂时增加输出语句代替打印

    visitVarStmt(stmt: VarStmt): R;
    visitBlockStmt(stmt: BlockStmt): R;
    visitIfStmt(stmt: IfStmt): R;
    visitWhileStmt(stmt: WhileStmt): R;
    visitDoWhileStmt(stmt: DoWhileStmt): R;
    visitForStmt(stmt: ForStmt): R;
    visitBreakStmt(stmt: BreakStmt): R;
    visitContinueStmt(stmt: ContinueStmt): R;
    visitFunctionStmt(stmt: FunctionStmt): R;
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

export class IfStmt implements Stmt {
    condition: Expr;
    thenBranch: Stmt;
    elseBranch?: Stmt;
    constructor(condition: Expr, thenBranch: Stmt, elseBranch?: Stmt) {
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
    }
    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitIfStmt(this);
    }
}

export class WhileStmt implements Stmt {
    condition: Expr;
    body: Stmt;
    constructor(condition: Expr, body: Stmt) {
        this.condition = condition;
        this.body = body;
    }
    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitWhileStmt(this);
    }

}


export class DoWhileStmt implements Stmt {
    condition: Expr;
    body: Stmt;
    constructor(condition: Expr, body: Stmt) {
        this.condition = condition;
        this.body = body;
    }
    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitDoWhileStmt(this);
    }
}

export class ForStmt implements Stmt {
    initializer: Stmt;
    condition: Expr;
    increment: Expr;
    body: Stmt;
    constructor(initializer: Stmt, condition: Expr, increment: Expr, body: Stmt) {
        this.initializer = initializer;
        this.condition = condition;
        this.increment = increment;
        this.body = body;
    }
    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitForStmt(this);
    }
}

export class BreakStmt implements Stmt {
    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitBreakStmt(this);
    }
}

export class ContinueStmt implements Stmt {
    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitContinueStmt(this);
    }
}



export class FunctionStmt implements Stmt {
    retType: VarType;
    name: Token;
    params: Var[];
    body: BlockStmt;

    constructor(var_type: VarType, name: Token, params: Var[], body:BlockStmt) {
        this.retType = var_type;
        this.name = name;
        this.params = params;
        this.body = body;
    }
    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitFunctionStmt(this);
    }

}