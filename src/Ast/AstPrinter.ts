import { AssignExpr, BinaryExpr, Expr, ExprVisitor, LiteralExpr, UnaryExpr, VariableExpr } from "./Expr";
import { ExpressionStmt, PrintStmt, Stmt, StmtVisitor, VarStmt } from "./Stmt";


export class AstPrinter implements ExprVisitor<string>, StmtVisitor<string> {

    // Stmt
    visitExpressionStmt(stmt: ExpressionStmt): string {
       return stmt.expression.accept(this);
    }
    visitPrintStmt(stmt: PrintStmt): string {
        return `print `+ stmt.expression.accept(this);
    }
    visitVarStmt(stmt: VarStmt): string {
       return stmt.initializer ? `${stmt.name.lexeme} = ${stmt.initializer.accept(this)}` : stmt.name.lexeme;
    }

    // Expr 
    visitAssignExpr(expr: AssignExpr): string {
        return `${expr.name.lexeme} = ${expr.value.accept(this)}`;
    }

    visitVariableExpr(expr: VariableExpr): string {
        return expr.name.lexeme;
    }
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

    print(stmt: Stmt[]) {
        for (const s of stmt) {
            console.log(s.accept(this));
        }
    }
}