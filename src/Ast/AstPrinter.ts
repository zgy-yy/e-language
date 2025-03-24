import { AssignExpr, BinaryExpr, Expr, ExprVisitor, GroupingExpr, LiteralExpr, UnaryExpr, VariableExpr } from "./Expr";
import { BlockStmt, ExpressionStmt, PrintStmt, Stmt, StmtVisitor, VarStmt } from "./Stmt";


export class AstPrinter implements ExprVisitor<string>, StmtVisitor<string> {
    
    // Stmt
    
    visitBlockStmt(stmt: BlockStmt): string {
        let str = "{\n";
        for (const s of stmt.statements) {
            str += s.accept(this) + "\n";
        }
        return str + "}";
    }


    visitExpressionStmt(stmt: ExpressionStmt): string {
       return stmt.expression.accept(this);
    }
    visitPrintStmt(stmt: PrintStmt): string {
        return `print `+ stmt.expression.accept(this);
    }
    visitVarStmt(stmt: VarStmt): string {
       return stmt.initializer ? `${stmt.variable.name} = ${stmt.initializer.accept(this)}` : stmt.variable.name;
    }

    // Expr 
    visitAssignExpr(expr: AssignExpr): string {
        return `${expr.variable.name} = ${expr.value.accept(this)}`;
    }

    visitVariableExpr(expr: VariableExpr): string {
        return expr.variable.name;
    }
    visitBinaryExpr(expr: BinaryExpr): string {
        return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
    }
    visitUnaryExpr(expr: UnaryExpr): string {
        return this.parenthesize(expr.operator.lexeme, expr.right);
    }

    visitLiteralExpr(expr: LiteralExpr): string {
        if (typeof expr.value === "string") {
            if (expr.value.length === 1) {
                return `'${expr.value}'`; 
            }
            return `"${expr.value}"`;
        }
           
        return expr.value;
    }
    visitGroupingExpr(expr: GroupingExpr): string {
        return this.parenthesize("group", expr.expression);
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