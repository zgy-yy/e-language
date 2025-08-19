import { ArrayType, DataKind, DataType, FunType, isSameType, PtrType, SimpleKind, SimpleType, StructType } from "../Parse/TypeDeclar";
import { El } from "../El/El";
import { Token, Tokenkind } from "../Lexer/Token"
import { FuncVar, Var } from "../Parse/Symbol";

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
}

export interface Expr { //表达式 基类
    exprType: DataType;
    accept<R>(visitor: ExprVisitor<R>, data?: any): R;
}



export class LogicalBinaryExpr implements Expr {
    exprType: DataType;
    left: Expr;
    operator: Token;
    right: Expr;
    constructor(left: Expr, operator: Token, right: Expr) {
        if (isSameType(left.exprType, new SimpleType(SimpleKind.Boolean)) && isSameType(right.exprType, new SimpleType(SimpleKind.Boolean))) {
            this.exprType = new SimpleType(SimpleKind.Boolean); //逻辑运算符的类型为布尔类型
        } else {
            El.error(operator, "Logical operator must be used with boolean values.")
        }
        this.left = left;
        this.operator = operator;
        this.right = right;
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
        if (isSameType(left.exprType, right.exprType)) {
            if (operator.type === Tokenkind.PLUS || operator.type === Tokenkind.MINUS || operator.type === Tokenkind.STAR || operator.type === Tokenkind.SLASH) {
                this.exprType = left.exprType;
            } else if (operator.type === Tokenkind.GREATER || operator.type === Tokenkind.GREATER_EQUAL || operator.type === Tokenkind.LESS || operator.type === Tokenkind.LESS_EQUAL || operator.type === Tokenkind.EQUAL_EQUAL || operator.type === Tokenkind.BANG_EQUAL) {
                this.exprType = new SimpleType(SimpleKind.Boolean);
            } else {
                El.error(operator, "Invalid operator in binary expression.")
            }
        } else {
            El.error(operator, "Type mismatch in binary expression.")
        }
        this.left = left;
        this.operator = operator;
        this.right = right;
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
        if ((operator.type === Tokenkind.MINUS || operator.type === Tokenkind.BANG) && isSameType(right.exprType, new SimpleType(SimpleKind.Int))) {
            this.exprType = new SimpleType(SimpleKind.Int); //一元表达式的类型为Int
        } else if (operator.type === Tokenkind.BANG && right.exprType instanceof SimpleType && isSameType(right.exprType, new SimpleType(SimpleKind.Boolean))) {
            this.exprType = new SimpleType(SimpleKind.Boolean); //一元表达式的类型为boolean
        } else {
            El.error(operator, "Unary operator must be used with integer or boolean values.")
        }
        this.operator = operator;
        this.right = right;
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
        if (right.exprType instanceof SimpleType && right.exprType.simpleKind === SimpleKind.Int) {
            this.exprType = new SimpleType(SimpleKind.Int); //前缀自增自减表达式的类型为Int
        } else {
            El.error(operator, "Prefix self operator must be used with integer values.")
        }
        this.right = right;
        this.operator = operator;
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
        if (left.exprType instanceof SimpleType && left.exprType.simpleKind === SimpleKind.Int) {
            this.exprType = new SimpleType(SimpleKind.Int); //后缀自增自减表达式的类型为Int
        } else {
            El.error(operator, "Suffix self operator must be used with integer values.")
        }
        this.left = left;
        this.operator = operator;
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitSuffixSelfExpr(this);
    }
}

//字面量表达式
export class LiteralExpr implements Expr {

    exprType: DataType;
    value: any;
    constructor(_val: any) {
        const _valType = typeof _val;
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
            El.error(_val, "Invalid literal value.")
        }
        this.value = _val;
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitLiteralExpr(this);
    }

}
//变量表达式，一个变量 名
export class VariableExpr implements Expr {
    exprType: DataType;
    variable: Var;
    constructor(var_: Var) {
        this.exprType = var_.type;
        this.variable = var_;
    }
    accept<R>(visitor: ExprVisitor<R>, isLeft: boolean): R {
        return visitor.visitVariableExpr(this, isLeft);
    }
}

//分组表达式
export class GroupingExpr implements Expr {
    exprType: DataType;
    expression: Expr;
    constructor(expression: Expr) {
        this.exprType = expression.exprType;
        this.expression = expression;
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
        if (!isSameType(var_.exprType, value.exprType)) {
            El.error(operator, "Type mismatch in assignment.")
        }

        this.exprType = var_.exprType;
        this.variable = var_;
        this.value = value;
        this.operator = operator;
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitAssignExpr(this);
    }

}

export class ArrowExpr implements Expr {
    exprType: DataType;
    left: VariableExpr;
    right: VariableExpr | LiteralExpr;
    arrow: Token;
    constructor(left: VariableExpr, right: VariableExpr | LiteralExpr, arrow: Token) {
        this.exprType = right.exprType;
        this.left = left;
        this.right = right;
        this.arrow = arrow;
        if (left.exprType instanceof PtrType) {
            this.exprType = left.exprType.elementType
            if (!isSameType(left.exprType.elementType, right.exprType)) {
                El.error(arrow, "Type mismatch in arrow expression.")
            }
        } else {
            El.error(arrow, "Arrow expression must be used with pointer type.")
        }

    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitArrowExpr(this);
    }
}

// 函数调用表达式   
export class CallExpr implements Expr {
    exprType: DataType; //函数调用表达式的类型为函数的返回值类型
    callee: Expr;
    paren: Token;
    args: Array<Expr>;
    constructor(callee: Expr, paren: Token, args: Array<Expr>) {
        // callee是函数声明
        if (callee instanceof VariableExpr && callee.variable instanceof FuncVar) {

            const paramsType = callee.variable.paramTypes
            if (paramsType.length !== args.length) {
                El.error(paren, "Type mismatch in call expression.")
            }
            for (let i = 0; i < paramsType.length; i++) {
                if (!isSameType(paramsType[i], args[i].exprType)) {
                    El.error(paren, "Type mismatch in call expression.")
                }
            }
            this.exprType = callee.variable.retType
        } else if (callee instanceof CallExpr) { //callee是函数调用表达式
            if (callee.exprType instanceof FunType) {
                const paramsType = callee.exprType.paramsType
                if (paramsType.length !== args.length) {
                    El.error(paren, "Type mismatch in call expression.")
                }
                for (let i = 0; i < paramsType.length; i++) {
                    if (!isSameType(paramsType[i], args[i].exprType)) {
                        El.error(paren, "Type mismatch in call expression.")
                    }
                }
                this.exprType = callee.exprType.retType
            } else {
                El.error(paren, "Call expression must be used with function.")
            }
        } else {
            El.error(paren, "Call expression must be used with function.")
        }

        this.callee = callee;
        this.paren = paren;
        this.args = args;
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitCallExpr(this);
    }

}

export class StructExpr implements Expr {
    exprType: DataType;
    fields: { field: string, value: Expr }[];
    constructor(fields: { field: string, value: Expr }[], structType: StructType) {
        this.exprType = structType
        this.fields = fields.sort((a, b) => a.field.localeCompare(b.field))
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitStructExpr(this);
    }
}

export class ArrayExpr implements Expr {
    exprType: DataType;
    elements: Expr[];
    constructor(elements: Expr[]) {
        if (elements.length === 0) {
            this.exprType = new ArrayType(new SimpleType(SimpleKind.Void), 0)
        } else {
            const elementType = elements[0].exprType
            for (const element of elements) {
                if (!isSameType(elementType, element.exprType)) {
                    El.error(null, "Type mismatch in array expression.")
                }
            }
            this.exprType = new ArrayType(elementType, elements.length)
        }
        this.elements = elements
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
    constructor(target: Expr, index: Expr) {
        if(target.exprType instanceof ArrayType){
            this.exprType = target.exprType.elementType;
            this.target = target;
            this.index = index;
        }else{
            El.error(null, "Index expression must be used with array.")
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
        if(array instanceof IndexExpr){
            this.exprType = array.exprType;
        }else{
            El.error(equals, "Type mismatch in assignment.")
        }
        if (!isSameType(this.exprType, value.exprType)) {
            El.error(equals, "Type mismatch in assignment.")
        }
        this.target = array;
        this.value = value;
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitSetIndexExpr(this);
    }
}

export class GetFieldExpr implements Expr {
    exprType: DataType;
    target: Expr;
    field: string;
    constructor(struct: Expr, field: string) {
        const structType = struct.exprType
        if (structType instanceof StructType) {
            this.exprType = structType.fields.find(f => f.field === field)?.type
        } else if (structType instanceof PtrType) {
            if (structType.elementType instanceof StructType) {
                this.exprType = structType.elementType.fields.find(f => f.field === field)?.type
            } else {
                El.error(null, "Get field expression must be used with struct.")
            }
        } else {
            El.error(null, "Get field expression must be used with struct.")
        }
        this.target = struct;
        this.field = field;
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
        if(struct instanceof GetFieldExpr){
            this.exprType = struct.exprType;
        }else{
            El.error(equals, "Type mismatch in assignment.")
        }
        if (!isSameType(this.exprType, value.exprType)) {
            El.error(equals, "Type mismatch in assignment.")
        }
        this.target = struct
        this.value = value;
        this.operator = equals;
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
    constructor(left: Expr, right: Expr) {
        this.exprType = right.exprType; //逗号表达式的类型为右操作数的类型
        this.left = left;
        this.right = right;
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitCommaExpr(this);
    }
}