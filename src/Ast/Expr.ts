import { Token } from "../Lexer/Token"
import { Var } from "../Parse/Symbol";

/*
* 表达式
*/
export interface ExprVisitor<R>{
    visitBinaryExpr(expr: BinaryExpr): R;
    visitUnaryExpr(expr: UnaryExpr): R;
    visitSuffixSelfExpr(expr: SuffixSelfExpr): R;
    visitLiteralExpr(expr: LiteralExpr): R;
    visitVariableExpr(expr: VariableExpr): R;
    visitAssignExpr(expr: AssignExpr): R;
    visitGroupingExpr(expr: GroupingExpr): R;
    visitLogicalBinaryExpr(expr: LogicalBinaryExpr): R;
    visitCallExpr(expr: CallExpr): R;
    visitCommaExpr(expr: CommaExpr): R;
}

export interface Expr{ //表达式 基类
    accept<R>(visitor: ExprVisitor<R>): R;
}



export class LogicalBinaryExpr implements Expr {

    left: Expr;
    operator: Token;
    right: Expr;
    constructor(left: Expr, operator: Token, right: Expr) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitLogicalBinaryExpr(this);
    }

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

export class UnaryExpr implements Expr {
    operator: Token;
    right: Expr;
    constructor(operator: Token, right: Expr) {
        this.operator = operator;
        this.right = right;
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitUnaryExpr(this);
    }
}

//后缀自增自减表达式
export class SuffixSelfExpr implements Expr { 
    left: Expr;
    operator: Token;
    constructor(left: Expr, operator: Token) {
        this.left = left;
        this.operator = operator;
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitSuffixSelfExpr(this);
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
//变量表达式，一个变量 名
export class VariableExpr implements Expr {
    variable: Var;
    constructor(var_: Var) {
        this.variable = var_;
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitVariableExpr(this);
    }
}

//分组表达式
export class GroupingExpr implements Expr {

    expression: Expr;
    constructor(expression: Expr) {
        this.expression = expression;
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitGroupingExpr(this);
    }
}

export class AssignExpr implements Expr {
    variable: Var;
    value: Expr;
    constructor(var_: Var, value: Expr) {
        this.variable = var_;
        this.value = value;
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitAssignExpr(this);
    }

}

// 函数调用表达式   
export class CallExpr implements Expr {
    callee: Expr;
    paren: Token;
    args: Array<Expr>;
    constructor(callee: Expr, paren: Token, args: Array<Expr>) {
        this.callee = callee;
        this.paren = paren;
        this.args = args;
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitCallExpr(this);
    }

}

export class CommaExpr implements Expr {
    left: Expr;
    right: Expr;
    constructor(left: Expr, right: Expr) {
        this.left = left;
        this.right = right;
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitCommaExpr(this);
    }
}