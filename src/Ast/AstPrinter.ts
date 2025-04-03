import { AssignExpr, BinaryExpr, CallExpr, CommaExpr, Expr, ExprVisitor, GroupingExpr, LiteralExpr, LogicalBinaryExpr, SuffixSelfExpr, UnaryExpr, VariableExpr } from "./Expr";
import { BlockStmt, BreakStmt, ContinueStmt, DoWhileStmt, ExpressionStmt, ForStmt, FunctionStmt, IfStmt, PrintStmt, Stmt, StmtVisitor, VarListStmt, VarStmt, WhileStmt } from "./Stmt";


export class AstPrinter implements ExprVisitor<string>, StmtVisitor<string> {



    // Stmt
    visitFunctionStmt(stmt: FunctionStmt): string {
       return `${stmt.retType} ${stmt.fn_name.name}(${stmt.params.map((p) => `${p.type} ${p.name}`).join(", ")}) ${stmt.body.accept(this)}`;
    }
    visitContinueStmt(stmt: ContinueStmt): string {
        return "continue";
    }

    visitBreakStmt(stmt: BreakStmt): string {
        return "break";
    }
    visitForStmt(stmt: ForStmt): string {
        return `for(${stmt.initializer.accept(this)}; ${stmt.condition.accept(this)}; ${stmt.increment.accept(this)}) ${stmt.body.accept(this)}`;
    }


    visitDoWhileStmt(stmt: DoWhileStmt): string {
        return `do ${stmt.body.accept(this)} while ${stmt.condition.accept(this)}`;
    }


    visitWhileStmt(stmt: WhileStmt): string {
        return `while ${stmt.condition.accept(this)} ${stmt.body.accept(this)}`;
    }


    visitIfStmt(stmt: IfStmt): string {
        let elseBranch = stmt.elseBranch ?"else " + stmt.elseBranch.accept(this) : "";
        return `if ${stmt.condition.accept(this)} ${stmt.thenBranch.accept(this)} ${elseBranch}`;
    }

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
    visitVarListStmt(stmt: VarListStmt): string {
       return `var ${stmt.varStmts.map((v) => v.accept(this)).join(", ")}`;
    }
    visitVarStmt(stmt: VarStmt): string {
       return stmt.initializer ? `${stmt.variable.name} = ${stmt.initializer.accept(this)}` : stmt.variable.name;
    }

    // Expr 
    visitLogicalBinaryExpr(expr: LogicalBinaryExpr): string {
        return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
    }

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

    visitSuffixSelfExpr(expr: SuffixSelfExpr): string {
        return  `${expr.left.accept(this)}${expr.operator.lexeme}`;
    }

    visitCallExpr(expr: CallExpr): string {
        return `${expr.callee.accept(this)}(${expr.args.map((arg) => arg.accept(this)).join(", ")})`;
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

    visitCommaExpr(expr: CommaExpr): string {
        return `${expr.left.accept(this)}, ${expr.right.accept(this)}`;
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