import { a } from "vite/dist/node/moduleRunnerTransport.d-CXw_Ws6P";
import { Token } from "../Lexer/Token"


export interface ExprVisitor<R>{
    visitBinaryExpr(expr: BinaryExpr): R;
    visitLiteralExpr(expr: LiteralExpr): R;
}

export interface Expr{ //表达式 基类
    accept<R>(visitor: ExprVisitor<R>): R;
}

// 二元表达式
export class BinaryExpr implements Expr{
    left: Expr
    operator: Token;
    right: Expr;
    constructor(left: Expr, operator: Token, right: Expr) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    accept<R>(visitor: ExprVisitor<R>): R {
      return visitor.visitBinaryExpr(this)
    }
}

//字面量表达式
export class LiteralExpr implements Expr {

    value: any;
    constructor(value: any) {
        this.value = value;
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitLiteralExpr(this);
    }

}