import { ArrayType } from "../Parse/TypeDeclar";
import { ArrayExpr, AssignExpr, BinaryExpr, CallExpr, CommaExpr, Expr, ExprVisitor, GetFieldExpr, GroupingExpr, LiteralExpr, LogicalBinaryExpr, PrefixSelfExpr, SetFieldExpr, StructExpr, SuffixSelfExpr, UnaryExpr, VariableExpr } from "./Expr";
import { BlockStmt, BreakStmt, ContinueStmt, DoWhileStmt, ExpressionStmt, ForStmt, FunctionStmt, IfStmt, LoopStmt, PrintStmt, ReturnStmt, Stmt, StmtVisitor, StructStmt, VarListStmt, VarStmt, WhileStmt } from "./Stmt";


export class AstPrinter implements ExprVisitor<string>, StmtVisitor<string> {

    // Stmt
    visitReturnStmt(stmt: ReturnStmt): string {
        return `return ${stmt.value ? stmt.value.accept(this) : 'void'}`;
    }

    visitFunctionStmt(stmt: FunctionStmt): string {
        return `${stmt.retType} ${stmt.fn_name.name}(${stmt.params.map((p) => `${p.type} ${p.name}`).join(", ")}) ${stmt.body.accept(this)}`;
    }

    visitStructStmt(stmt: StructStmt): string {
        return `struct ${stmt.structure.name} { ${Array.from(stmt.structure.fields.entries()).map(([name, type]) => `${type} ${name}`).join(", ")} }`;
    }

    visitContinueStmt(stmt: ContinueStmt): string {
        return "continue";
    }

    visitBreakStmt(stmt: BreakStmt): string {
        return "break";
    }

    visitLoopStmt(stmt: LoopStmt): string {
        return `loop ${stmt.body.accept(this)}`;
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
        let elseBranch = stmt.elseBranch ? "else " + stmt.elseBranch.accept(this) : "";
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
        return `print ` + stmt.expression.accept(this);
    }
    visitVarListStmt(stmt: VarListStmt): string {
        // 获取变量类型
        const varType = stmt.varStmts[0].variable.type
        if (varType instanceof ArrayType) {
            return `[${varType.lengthExpr.accept(this)}]${varType.elementType.toString()} ${stmt.varStmts.map((v) => v.accept(this)).join(", ")}`;
        }
        return `${varType} ${stmt.varStmts.map((v) => v.accept(this)).join(", ")}`;

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

    visitArrayExpr(expr: ArrayExpr): string {
        return `[${expr.elements.map((e) => e.accept(this)).join(", ")}]`;
    }

    visitStructExpr(expr: StructExpr): string {
        return `{ ${Array.from(expr.fields.entries()).map(([name, value]) => `${name}: ${value.accept(this)}`).join(", ")} }`;
    }

    visitGetFieldExpr(expr: GetFieldExpr): string {
        return `${expr.target.accept(this)}.${expr.field}`;
    }

    visitSetFieldExpr(expr: SetFieldExpr): string {
        return `${expr.target.accept(this)}.${expr.field} = ${expr.value.accept(this)}`;
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

    visitPrefixSelfExpr(expr: PrefixSelfExpr): string {
        return this.parenthesize(expr.operator.lexeme, expr.right);
    }

    visitSuffixSelfExpr(expr: SuffixSelfExpr): string {
        return `${expr.left.accept(this)} ${expr.operator.lexeme}`;
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