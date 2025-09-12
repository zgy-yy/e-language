import { ArrayType, DataKind, DataType, FunType, isSameType, PtrType, SimpleKind, SimpleType, StructType } from "../Parse/TypeDeclar";
import { El } from "../El/El";
import { Token, Tokenkind } from "../Lexer/Token"
import { FuncVar, FunLable, Var } from "../Parse/Symbol";
import { Stmt } from "./Stmt";

/*
* 表达式
*/
export interface ExprVisitor<R> {
    visitArrayExpr(expr: ArrayExpr): R;
    visitStructExpr(expr: StructExpr): R;
    visitBinaryExpr(expr: BinaryExpr): R;
    visitUnaryExpr(expr: UnaryExpr): R;
    visitSuffixSelfExpr(expr: SuffixSelfExpr): R;
    visitPrefixSelfExpr(expr: PrefixSelfExpr): R;
    visitLiteralExpr(expr: LiteralExpr): R;
    visitVariableExpr(expr: VariableExpr, isLeft: boolean): R;
    visitAssignExpr(expr: AssignExpr): R;
    visitGroupingExpr(expr: GroupingExpr): R;
    visitLogicalBinaryExpr(expr: LogicalBinaryExpr): R;
    visitCallExpr(expr: CallExpr): R;
    visitCommaExpr(expr: CommaExpr): R;
    visitGetFieldExpr(expr: GetFieldExpr, isLeft: boolean): R;
    visitSetFieldExpr(expr: SetFieldExpr): R;
    visitIndexExpr(expr: IndexExpr, isLeft: boolean): R;
    visitSetIndexExpr(expr: SetIndexExpr): R;
    visitArrowExpr(expr: ArrowExpr): R;
    visitInitializerExpr(expr: InitializerExpr): R;
    visitFunctionExpr(expr: FunctionExpr): R;
}

export interface Expr { //表达式 基类
    exprType: DataType;
    operator: Token;
    accept<R>(visitor: ExprVisitor<R>, data?: any): R
    verify(): void
}



export class LogicalBinaryExpr implements Expr {
    exprType: DataType;
    left: Expr;
    operator: Token;
    right: Expr;
    constructor(left: Expr, operator: Token, right: Expr) {
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.exprType = new SimpleType(SimpleKind.Boolean); //逻辑运算符的类型为布尔类型
    }
    verify(): void {
        this.left.verify()
        this.right.verify()

        if (isSameType(this.left.exprType, new SimpleType(SimpleKind.Boolean)) && isSameType(this.right.exprType, new SimpleType(SimpleKind.Boolean))) {
        } else {
            El.error(this.operator, "Logical operator must be used with boolean values.")
        }
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitLogicalBinaryExpr(this);
    }

}

// 二元表达式
export class BinaryExpr implements Expr {
    exprType: DataType;
    left: Expr
    operator: Token;
    right: Expr;
    constructor(left: Expr, operator: Token, right: Expr) {
        this.left = left;
        this.operator = operator;
        this.right = right;
        if (operator.type === Tokenkind.PLUS || operator.type === Tokenkind.MINUS || operator.type === Tokenkind.STAR || operator.type === Tokenkind.SLASH) {
            this.exprType = new SimpleType(SimpleKind.Int);
        } else if (operator.type === Tokenkind.GREATER || operator.type === Tokenkind.GREATER_EQUAL || operator.type === Tokenkind.LESS || operator.type === Tokenkind.LESS_EQUAL || operator.type === Tokenkind.EQUAL_EQUAL || operator.type === Tokenkind.BANG_EQUAL) {
            this.exprType = new SimpleType(SimpleKind.Boolean);
        } else {
            El.error(operator, "Invalid operator in binary expression.")
        }
    }
    verify(): void {
        this.left.verify()
        this.right.verify()
        if (!isSameType(this.left.exprType, this.right.exprType)) {
            El.error(this.operator, "Type mismatch in binary expression.")
        }
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitBinaryExpr(this)
    }
}

export class UnaryExpr implements Expr {
    exprType: DataType;
    operator: Token;
    right: Expr;
    constructor(operator: Token, right: Expr) {
        this.operator = operator;
        this.right = right;
        if (operator.type === Tokenkind.PLUS || operator.type === Tokenkind.MINUS) {
            this.exprType = new SimpleType(SimpleKind.Int);
        } else if (operator.type === Tokenkind.BANG) {
            this.exprType = new SimpleType(SimpleKind.Boolean);
        } else {
            El.error(operator, "Invalid operator in unary expression.")
        }
    }
    verify(): void {
        this.right.verify()
        if (!isSameType(this.right.exprType, this.exprType)) {
            El.error(this.operator, "Type mismatch in unary expression.")
        }
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitUnaryExpr(this);
    }
}

//前缀自增自减表达式
export class PrefixSelfExpr implements Expr {
    exprType: DataType;
    right: Expr;
    operator: Token;
    constructor(operator: Token, right: Expr) {
        this.right = right;
        this.operator = operator;
        if (operator.type === Tokenkind.PLUS_PLUS || operator.type === Tokenkind.MINUS_MINUS) {
            this.exprType = new SimpleType(SimpleKind.Int); //前缀自增自减表达式的类型为Int
        } else {
            El.error(operator, "Invalid operator in prefix self expression.")
        }
    }
    verify(): void {
        this.right.verify()
        if (!isSameType(this.right.exprType, this.exprType)) {
            El.error(this.operator, "Type mismatch in prefix self expression.")
        }
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitPrefixSelfExpr(this);
    }
}

//后缀自增自减表达式
export class SuffixSelfExpr implements Expr {
    exprType: DataType;
    left: Expr;
    operator: Token;
    constructor(left: Expr, operator: Token) {
        this.left = left;
        this.operator = operator;
        if (operator.type === Tokenkind.PLUS_PLUS || operator.type === Tokenkind.MINUS_MINUS) {
            this.exprType = new SimpleType(SimpleKind.Int); //后缀自增自减表达式的类型为Int
        } else {
            El.error(operator, "Invalid operator in suffix self expression.")
        }
    }
    verify(): void {
        this.left.verify()
        if (!isSameType(this.left.exprType, this.exprType)) {
            El.error(this.operator, "Type mismatch in suffix self expression.")
        }
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitSuffixSelfExpr(this);
    }
}

//字面量表达式
export class LiteralExpr implements Expr {
    exprType: DataType;
    value: string;
    operator: Token;
    constructor(_val: Token) {
        this.value = _val.literal;
        this.operator = _val
        const _valType = typeof _val.literal;
        if (_valType === 'string') {
            // this.exprType = new SimpleType(SimpleKind.String);
            // if (_val.length === 1) {
            //     this.exprType = new SimpleType(SimpleKind.Char);
            // }
        } else if (_valType === 'number') {
            this.exprType = new SimpleType(SimpleKind.Int);
        } else if (_valType === 'boolean') {
            this.exprType = new SimpleType(SimpleKind.Boolean);
        } else {
            El.error(this.operator, "Invalid literal value.")
        }

    }
    verify(): void {
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitLiteralExpr(this);
    }

}
//变量表达式，一个变量 名
export class VariableExpr implements Expr {
    exprType: DataType;
    variable: Var;
    operator: Token;
    constructor(var_: Var, operator: Token) {
        this.variable = var_;
        this.operator = operator
        this.exprType = var_.type;
    }
    verify(): void {
    }
    accept<R>(visitor: ExprVisitor<R>, isLeft: boolean): R {
        return visitor.visitVariableExpr(this, isLeft);
    }
}

//分组表达式
export class GroupingExpr implements Expr {
    exprType: DataType;
    expression: Expr;
    operator: Token;
    constructor(expression: Expr, operator: Token) {
        this.expression = expression;
        this.operator = operator;
        this.exprType = expression.exprType;
    }
    verify(): void {
        this.expression.verify()
        if (!isSameType(this.expression.exprType, this.exprType)) {
            El.error(this.operator, "Type mismatch in grouping expression.")
        }
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitGroupingExpr(this);
    }
}

export class AssignExpr implements Expr {
    exprType: DataType;
    variable: VariableExpr;
    operator: Token;
    value: Expr;
    constructor(var_: VariableExpr, value: Expr, operator: Token) {
        this.exprType = var_.exprType;
        this.variable = var_;
        this.value = value;
        this.operator = operator;
    }
    verify(): void {
        this.variable.verify()
        this.value.verify()
        if (!isSameType(this.variable.exprType, this.value.exprType)) {
            El.error(this.operator, "Type mismatch in assignment.")
        }
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitAssignExpr(this);
    }

}

export class ArrowExpr implements Expr {
    exprType: DataType;
    left: VariableExpr;
    right: VariableExpr | LiteralExpr;
    operator: Token;
    constructor(left: VariableExpr, right: VariableExpr | LiteralExpr, arrow: Token) {
        this.exprType = right.exprType;
        this.left = left;
        this.right = right;
        this.operator = arrow;
    }
    verify(): void {
        this.left.verify()
        this.right.verify()
        if (this.left.exprType instanceof PtrType) {
            this.exprType = this.left.exprType.elementType
            if (!isSameType(this.left.exprType.elementType, this.right.exprType)) {
                El.error(this.operator, "Type mismatch in arrow expression.")
            }
        } else {
            El.error(this.operator, "Arrow expression must be used with pointer type.")
        }
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitArrowExpr(this);
    }
}

//初始化表达式
export class InitializerExpr implements Expr {
    exprType: DataType;
    operator: Token;
    _var: Var;
    initializer: Expr | null;
    constructor(expr: Expr, operator: Token, _var: Var) {
        this.exprType = expr?.exprType;
        this.operator = operator;
        this.initializer = expr;
        this._var = _var;
    }
    verify(): void {
        if (this.initializer) {
            this.initializer.verify()
            if (!isSameType(this._var.type, this.initializer.exprType)) {
                El.error(this.operator, "Type mismatch in initializer expression.")
            }
        }
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitInitializerExpr(this);
    }
}

// 函数调用表达式   
export class CallExpr implements Expr {
    exprType: DataType; //函数调用表达式的类型为函数的返回值类型
    callee: Expr;
    operator: Token;
    args: Array<Expr>;
    constructor(callee: Expr, paren: Token, args: Array<Expr>) {
        this.callee = callee;
        this.operator = paren;
        this.args = args;

    }
    verify(): void {
        this.callee.verify()
        this.args.forEach(arg => arg.verify())
        // callee是函数声明
        if (this.callee instanceof FunctionExpr) {
            const paramsType = this.callee.fun_lable.paramsType
            if (paramsType.length !== this.args.length) {
                El.error(this.operator, "Type mismatch in call expression.")
            }
            for (let i = 0; i < paramsType.length; i++) {
                if (!isSameType(paramsType[i], this.args[i].exprType)) {
                    El.error(this.operator, "Type mismatch in call expression.")
                }
            }
            this.exprType = this.callee.fun_lable.retType
        } else if (this.callee instanceof CallExpr) { //callee是函数调用表达式
            if (this.callee.exprType instanceof FunType) {
                const paramsType = this.callee.exprType.paramsType
                if (paramsType.length !== this.args.length) {
                    El.error(this.operator, "Type mismatch in call expression.")
                }
                for (let i = 0; i < paramsType.length; i++) {
                    if (!isSameType(paramsType[i], this.args[i].exprType)) {
                        El.error(this.operator, "Type mismatch in call expression.")
                    }
                }
                this.exprType = this.callee.exprType
            } else {
                El.error(this.operator, "Call expression must be used with function.")
            }
        } else if (this.callee instanceof VariableExpr) {
            if (this.callee.variable instanceof FuncVar) {
                const fun_var = this.callee.variable
                const paramsType = fun_var.paramsType
                if (paramsType.length !== this.args.length) {
                    El.error(this.operator, "Type mismatch in call expression.")
                }
                for (let i = 0; i < paramsType.length; i++) {
                    if (!isSameType(paramsType[i], this.args[i].exprType)) {
                        El.error(this.operator, "Type mismatch in call expression.")
                    }
                }
                this.exprType = this.callee.variable.retType

            } else {
                El.error(this.operator, "Call expression must be used with function.")
            }
        } else {
            El.error(this.operator, "Call expression must be used with function.")
        }
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitCallExpr(this);
    }

}

export class StructExpr implements Expr {
    exprType: DataType;
    fields: { field: string, value: Expr }[];
    operator: Token;
    constructor(fields: { field: string, value: Expr }[], paren: Token) {
        this.fields = fields.sort((a, b) => a.field.localeCompare(b.field))
        this.exprType = new StructType('anonymous', fields.map(f => ({ field: f.field, type: f.value.exprType })))
        this.operator = paren;
    }
    verify(): void {
        this.fields.forEach(f => f.value.verify())
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitStructExpr(this);
    }
}

export class ArrayExpr implements Expr {
    exprType: DataType;
    elements: Expr[];
    operator: Token;
    constructor(elements: Expr[], paren: Token) {
        this.elements = elements
        this.operator = paren;

    }
    verify(): void {
        this.elements.forEach(e => e.verify())
        if (this.elements.length === 0) {
            this.exprType = new ArrayType(new SimpleType(SimpleKind.Void), 0)
        } else {
            const elementType = this.elements[0].exprType
            for (const element of this.elements) {
                if (!isSameType(elementType, element.exprType)) {
                    El.error(null, "Type mismatch in array expression.")
                }
            }
            this.exprType = new ArrayType(elementType, this.elements.length)
        }

    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitArrayExpr(this);
    }
}

export class IndexExpr implements Expr {
    exprType: DataType;
    target: Expr;
    index: Expr;
    operator: Token;
    constructor(target: Expr, index: Expr, paren: Token) {
        this.target = target;
        this.index = index;
        this.operator = paren;
    }

    verify(): void {
        this.target.verify()
        this.index.verify()
        const targetType = this.target.exprType
        if (targetType instanceof ArrayType) {
            this.exprType = targetType.elementType;
        } else if (targetType instanceof PtrType) {
            if (targetType.elementType instanceof ArrayType) {
                this.exprType = targetType.elementType.elementType
            } else {
                El.error(this.operator, "Index expression must be use with array")
            }
        } else {
            El.error(this.operator, "Index expression must be used with array.")
        }
    }
    accept<R>(visitor: ExprVisitor<R>, isLeft: boolean): R {
        return visitor.visitIndexExpr(this, isLeft);
    }
}

export class SetIndexExpr implements Expr {
    exprType: DataType;
    target: Expr;
    value: Expr;
    operator: Token;
    constructor(array: Expr, value: Expr, equals: Token) {
        this.target = array;
        this.value = value;
        this.operator = equals;
    }
    verify(): void {
        this.target.verify()
        this.value.verify()
        if (this.target instanceof IndexExpr) {
            this.exprType = this.target.exprType;
        } else {
            El.error(this.operator, "Type mismatch in assignment.")
        }
        if (!isSameType(this.exprType, this.value.exprType)) {
            El.error(this.operator, "Type mismatch in assignment.")
        }
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitSetIndexExpr(this);
    }
}

export class GetFieldExpr implements Expr {
    exprType: DataType;
    target: Expr;
    field: string;
    operator: Token;
    constructor(struct: Expr, field: string, paren: Token) {
        this.target = struct;
        this.field = field;
        this.operator = paren;
    }
    verify(): void {
        this.target.verify()
        const targetType = this.target.exprType
        if (targetType instanceof StructType) {
            this.exprType = targetType.fields.find(f => f.field === this.field)?.type
        } else if (targetType instanceof PtrType) {
            if (targetType.elementType instanceof StructType) {
                this.exprType = targetType.elementType.fields.find(f => f.field === this.field)?.type
            } else {
                El.error(null, "Get field expression must be used with struct.")
            }
        } else {
            El.error(null, "Get field expression must be used with struct.")
        }
    }
    accept<R>(visitor: ExprVisitor<R>, isLeft: boolean): R {
        return visitor.visitGetFieldExpr(this, isLeft);
    }
}

export class SetFieldExpr implements Expr {
    exprType: DataType;
    target: Expr;
    value: Expr;
    operator: Token;
    constructor(struct: Expr, value: Expr, equals: Token) {
        this.target = struct
        this.value = value;
        this.operator = equals;
    }
    verify(): void {
        this.target.verify()
        this.value.verify()
        if (this.target instanceof GetFieldExpr) {
            this.exprType = this.target.exprType;
        } else {
            El.error(this.operator, "Type mismatch in assignment.")
        }
        if (!isSameType(this.exprType, this.value.exprType)) {
            El.error(this.operator, "Type mismatch in assignment.")
        }
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitSetFieldExpr(this);
    }
}
export class CommaExpr implements Expr {
    exprType: DataType;
    left: Expr;
    right: Expr;
    operator: Token;
    constructor(left: Expr, right: Expr, comma: Token) {
        this.exprType = right.exprType; //逗号表达式的类型为右操作数的类型
        this.left = left;
        this.right = right;
        this.operator = comma;
    }
    verify(): void {
        this.left.verify()
        this.right.verify()
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitCommaExpr(this);
    }
}

export class FunctionExpr implements Expr {
    exprType: DataType;
    fun_lable: FunLable;
    operator: Token;
    params: Var[];
    body?: Stmt[];
    constructor(fun_lable: FunLable, paren: Token, body?: Stmt[], params?: Var[]) {
        this.fun_lable = fun_lable;
        this.operator = paren;
        this.body = body;
        this.params = params ?? [];
    }
    verify(): void {
        if (!this.fun_lable) {
            El.error(this.operator, "Undefined function.")
        }
        this.exprType = this.fun_lable.type
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitFunctionExpr(this);
    }
}