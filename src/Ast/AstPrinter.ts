import { BinaryExpr, Expr, ExprVisitor, LiteralExpr, UnaryExpr } from "./Expr";


export class AstPrinter implements ExprVisitor<string>{
    visitBinaryExpr(expr: BinaryExpr): string {
        return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
    }
    visitUnaryExpr(expr: UnaryExpr): string {
        return this.parenthesize(expr.operator.lexeme, expr.right);
    }

    visitLiteralExpr(expr: LiteralExpr): string {
        return expr.value.toString();
    }
    
    parenthesize(name: string, ...exprs: Expr[]) {
        return `(${name} ${exprs.map((expr) => `${expr.accept(this)}`).join(" ")})`;
    }

    print(expr: Expr) {
        console.log(expr.accept(this));
    }
}