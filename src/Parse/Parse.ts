import { ArrayExpr, ArrowExpr, AssignExpr, BinaryExpr, CallExpr, CommaExpr, Expr, FunctionExpr, GetFieldExpr, GroupingExpr, IndexExpr, InitializerExpr, LiteralExpr, LogicalBinaryExpr, PrefixSelfExpr, SetFieldExpr, SetIndexExpr, StructExpr, SuffixSelfExpr, TupleExpr, UnaryExpr, VariableExpr } from "../Ast/Expr";
import { BlockStmt, BreakStmt, ContinueStmt, DoWhileStmt, ExpressionStmt, ForStmt, FunctionStmt, IfStmt, LoopStmt, PrintStmt, ReturnStmt, Stmt, StructStmt, VarListStmt, VarStmt, WhileStmt } from "../Ast/Stmt";
import { El } from "../El/El";
import { Token, Tokenkind } from "../Lexer/Token";
import { ArrayType, DataType, FunType, isSameType, PtrType, SimpleKind, SimpleType, StructType, TupleType } from "./TypeDeclar";
import { ScopeType, SymbolTable } from "./SymbolTable";
import { FuncVar, Var, StructVar, ArrayVar, FunLable } from "./Symbol";

type FuncEnclosing = {
    funcName: string,
    params: Var[]
    dclRetType: DataType //声明的返回值类型
}
export class Parser {
    tokens: Token[]
    current: number = 0;//tokens 游标

    symbolTable: SymbolTable = new SymbolTable();//符号表 
    funcEnclosing: FuncEnclosing[] = []//函数块
    loopEnclosing: string[] = []//循环块

    typeKind = [Tokenkind.INT, Tokenkind.CHAR, Tokenkind.VOID, Tokenkind.BOOLEAN, Tokenkind.STRING]

    statements: Stmt[] = []

    //含有未声明的变量的表达式语句
    unKnowFuncLabelExprSmt: Map<Expr, Map<string, FunctionExpr>> = new Map()
    //当前解析的表达式语句里 未声明的变量
    curExprSmtUnknowFuncLabel: Map<string, FunctionExpr> = new Map()

    constructor(tokens: Token[]) {
        this.tokens = tokens
    }

    parse() {//解析程序
        while (!this.isAtEnd()) {
            this.statements.push(this.declaration())//程序由多个声明语句组成
        }
        this.unKnowFuncLabelExprSmt.forEach((value, key) => {
            value.forEach((funcLabelExpr, name) => {
                funcLabelExpr.verify()
            })
        })
        return { //返回程序的抽象语法树，包含变量表和语句
            stmt: this.statements
        }
    }

    //语句
    // 程序语句 declaration -> varDeclaration | functionDeclaration 
    declaration(): Stmt {
        try {
            const stmt = this.declarationStmt()
            if (stmt) {
                return stmt
            }
            throw this.error(this.peek(), "Expect declaration.")
        } catch (error) {
            if (error instanceof ParseError) {
                this.synchronize()
            } else {
                throw error
            }
        }
    }

    // 声明类型
    declarationKind(): DataType | null {
        const i = this.current //记录当前位置
        const declaration = () => {
            let declType: DataType = null
            if (this.match(...this.typeKind)) {
                let kind = this.previous()//声明的类型
                declType = new SimpleType(SimpleKind[kind.type])//声明 类型
            } else if (this.peek().type == Tokenkind.IDENTIFIER) {
                const struct_name = this.peek().lexeme
                const struct = this.symbolTable.findStructure(struct_name)
                if (struct) {
                    this.advance()
                    declType = struct
                }
            } else if (this.match(Tokenkind.LEFT_PAREN)) {

                const paramsType: DataType[] = []
                if (!this.check(Tokenkind.RIGHT_PAREN)) {
                    do {
                        if (paramsType.length >= 255) {
                            this.error(this.peek(), "Can't have more than 255 parameters.")
                        }
                        const declType = declaration()
                        if (declType) {
                            paramsType.push(declType)
                        }
                    } while (this.match(Tokenkind.COMMA))
                }
                //如果匹配到标识符，则表示函数表达式
                if (this.peek().type !== Tokenkind.RIGHT_PAREN) {
                    this.back(i)
                    return null
                }
                this.consume(Tokenkind.RIGHT_PAREN, "Expect ')' after parameters.")
                if (this.match(...this.typeKind)) {
                    let kind = this.previous()//声明的类型
                    let retType: DataType = new SimpleType(SimpleKind[kind.type])//声明 的类型
                    declType = new FunType(paramsType, retType)
                }
                else {
                    this.error(this.peek(), "Expect type after parameters.")
                }
                //如果匹配到左大括号，则表示函数表达式
                if (this.peek().type == Tokenkind.LEFT_BRACE) {
                    this.back(i)
                    return null
                }
            } else if (this.match(Tokenkind.LEFT_BRACKET)) {
                const elementsType: DataType[] = []
                do {
                    const elementType = declaration()
                    if (elementType) {
                        elementsType.push(elementType)
                    }
                } while (this.match(Tokenkind.COMMA))
                if (elementsType.length !== 0) {
                    this.consume(Tokenkind.RIGHT_BRACKET, "Expect ']' after array elements.")
                    declType = new TupleType(elementsType)
                } else {
                    const lenExpr = this.expression()
                    if (lenExpr instanceof LiteralExpr && typeof lenExpr.value === 'number') {
                        const len = lenExpr.value as number
                        this.consume(Tokenkind.RIGHT_BRACKET, "Expect ']' after array length.")
                        const array_type = declaration()
                        declType = new ArrayType(array_type, len)
                    } else {
                        this.error(this.peek(), "Array length must be a number literal.")
                    }
                }

            }
            return declType
        }

        let declType = declaration()
        if (this.match(Tokenkind.AT)) {
            declType = new PtrType(declType)
        }

        return declType
    }

    /* 语句 statement -> printStatement | block | ifStatement | whileStatement | doWhileStatement | forStatement 
                        | breakStatement | continueStatement | expressionStatement
                        
     */
    /* 语句语句 statementStmt -> declarationStmt | statement */
    statementStmt(): Stmt {
        const stmt = this.declarationStmt()
        if (stmt) {
            return stmt
        }
        return this.statement()
    }

    /* 声明语句 declarationStmt -> structStatement | funcDeclaration | varListDeclaration */
    declarationStmt(): Stmt {
        if (this.match(Tokenkind.STRUCT)) {
            return this.structStatement()
        }
        let declType = this.declarationKind()
        if (declType) {
            if (this.peekNext().type == Tokenkind.LEFT_PAREN) {
                return this.funcDeclaration(declType)
            }
            return this.varListDeclaration(declType)
        }
        return null;
    }


    statement(): Stmt {
        if (this.match(Tokenkind.PRINT))
            return this.printStatement()
        if (this.match(Tokenkind.LEFT_BRACE))
            return this.blockStatement()
        if (this.match(Tokenkind.IF))
            return this.ifStatement()
        if (this.match(Tokenkind.WHILE))
            return this.whileStatement()
        if (this.match(Tokenkind.Do))
            return this.doWhileStatement()
        if (this.match(Tokenkind.FOR))
            return this.forStatement()
        if (this.match(Tokenkind.LOOP))
            return this.loopStatement()
        if (this.match(Tokenkind.BREAK))
            return this.breakStatement()
        if (this.match(Tokenkind.CONTINUE))
            return this.continueStatement()
        if (this.match(Tokenkind.RETURN))
            return this.returnStatement()

        return this.expressionStatement()
    }




    //变量声明语句
    varListDeclaration(varT: DataType): Stmt {
        if (varT instanceof SimpleType && varT.simpleKind === SimpleKind.Void) {
            El.error(this.previous(), "void type is not supported.")
        }
        let varStmt: VarStmt[] = []
        const var_name = this.consume(Tokenkind.IDENTIFIER, "Expect identifier name.")//变量名
        if (this.symbolTable.identifierInCurrentScope(var_name.lexeme)) {
            this.error(var_name, "Variable with this name already declared in this scope.")
        }

        let var_: Var = null
        if (varT instanceof FunType) {
            var_ = new FuncVar(var_name.lexeme, varT)
            //声明变量为 函数类型，提前加入符号表
            this.symbolTable.addIdentifier(var_name.lexeme, var_)
        } else if (varT instanceof StructType) {
            var_ = new StructVar(var_name.lexeme, varT, varT.fields)
        } else if (varT instanceof ArrayType) {
            var_ = new ArrayVar(var_name.lexeme, varT)
        } else {
            var_ = new Var(var_name.lexeme, varT)
        }

        let initializer: Expr = null

        let operator: Token = null

        if (varT instanceof PtrType) {
            if (this.match(Tokenkind.ARROW)) {
                initializer = this.assignment()
                operator = this.previous()
            }
        } else {
            if (this.match(Tokenkind.EQUAL)) {
                initializer = this.assignment()//初始化表达式 不能包含 逗号表达式z
                operator = this.previous()
            }
        }

        //解析过 initializer 后添加，防止定义的变量出现在 初始化表达式中
        this.symbolTable.addIdentifier(var_name.lexeme, var_)


        let initializerExpr = new InitializerExpr(initializer, operator, var_)
        if (initializer && this.curExprSmtUnknowFuncLabel.size > 0) {
            this.unKnowFuncLabelExprSmt.set(initializerExpr, this.curExprSmtUnknowFuncLabel)
            this.curExprSmtUnknowFuncLabel = new Map()
        } else {
            initializerExpr && initializerExpr.verify()
        }
        if (this.symbolTable.currentLevel === 0 && initializer) {
            if (!(initializer instanceof LiteralExpr || initializer instanceof FunctionExpr)) {
                this.error(operator, "Global variable initializer must be a literal.")
            }
        }

        varStmt.push(new VarStmt(var_, initializerExpr))

        while (this.match(Tokenkind.COMMA)) {
            let var_name = this.consume(Tokenkind.IDENTIFIER, "Expect identifier name.") //标识符名称
            if (this.symbolTable.identifierInCurrentScope(var_name.lexeme)) {
                this.error(var_name, "Variable with this name already declared in this scope.")
            }
            const var_ = new Var(var_name.lexeme, varT)
            this.symbolTable.addIdentifier(var_name.lexeme, var_)
            let initializer = null
            if (this.match(Tokenkind.EQUAL)) {
                initializer = this.assignment()
            }
            let initializerExpr = null
            if (initializer) {
                initializerExpr = new InitializerExpr(initializer, operator, var_)
            }
            if (initializer && this.curExprSmtUnknowFuncLabel.size > 0) {
                this.unKnowFuncLabelExprSmt.set(initializerExpr, this.curExprSmtUnknowFuncLabel)
                this.curExprSmtUnknowFuncLabel = new Map()
            } else {
                initializerExpr && initializerExpr.verify()
            }
            if (this.symbolTable.currentLevel === 0 && initializer) {
                if (!(initializer instanceof LiteralExpr || initializer instanceof FunctionExpr)) {
                    this.error(operator, "Global variable initializer must be a literal.")
                }
            }
            varStmt.push(new VarStmt(var_, initializerExpr))
        }
        this.consume(Tokenkind.SEMICOLON, "Expect ';' after variable declaration.")
        return new VarListStmt(varStmt)
    }


    //函数声明
    // functionDeclaration -> type IDENTIFIER "(" parameters? ")" block
    funcDeclaration(dclRetType: DataType): Stmt {
        const fun_name = this.consume(Tokenkind.IDENTIFIER, "Expect function name.")//函数名
        this.consume(Tokenkind.LEFT_PAREN, "Expect '(' after function name.")
        const params: Var[] = []
        if (!this.check(Tokenkind.RIGHT_PAREN)) {
            params.push(...this.paramDeclaration())
        }
        const fun_lable = new FunLable(fun_name.lexeme, new FunType(params.map(item => item.type), dclRetType)) //函数声明 视为变
        this.symbolTable.addIdentifier(fun_name.lexeme, fun_lable)//将函数名加入符号表

        const funcEn: FuncEnclosing = {
            funcName: fun_name.lexeme,
            params: params,
            dclRetType: dclRetType
        }
        this.funcEnclosing.push(funcEn)
        this.consume(Tokenkind.RIGHT_PAREN, "Expect ')' after parameters.")
        this.consume(Tokenkind.LEFT_BRACE, "Expect '{' before function body.")
        // 进入函数作用域
        this.symbolTable.enterScope(ScopeType.Function)
        params.forEach(item => {
            this.symbolTable.addIdentifier(item.name, item)
        })
        // 解析函数体
        const bodyStatements: Stmt[] = []
        while (!this.check(Tokenkind.RIGHT_BRACE) && !this.isAtEnd()) {
            bodyStatements.push(this.statementStmt())
        }
        // 如果函数体最后没有 return 语句
        if (!(bodyStatements.at(-1) instanceof ReturnStmt)) {
            if (dclRetType instanceof SimpleType && dclRetType.simpleKind === SimpleKind.Void) {
                bodyStatements.push(new ReturnStmt(new Token(Tokenkind.RETURN, "return", null, this.previous().line), null))
            } else {
                this.error(this.previous(), "Function must have a return value.")
            }
        }

        this.consume(Tokenkind.RIGHT_BRACE, "Expect '}' after function block.")
        // 如果函数返回值类型为void，切没有明确返回值，则添加一个返回值为void的返回语句
        this.symbolTable.leaveScope()
        this.funcEnclosing.pop()
        return new FunctionStmt(dclRetType, fun_lable, params, bodyStatements)
    }

    paramDeclaration(): Var[] {
        let declType = this.declarationKind()
        const declParamVars: Var[] = []
        if (declType) {
            do {
                if (declParamVars.length >= 255) {
                    this.error(this.peek(), "Can't have more than 255 parameters.")
                }
                const declType_ = this.declarationKind()
                if (declType_) {//遇到下一个参数类型，
                    declType = declType_
                }
                let identifier_name = this.consume(Tokenkind.IDENTIFIER, "Expect identifier name.") //标识符名称
                if (declType instanceof FunType) {
                    const declParamVar = new FuncVar(identifier_name.lexeme, declType)
                    declParamVars.push(declParamVar)
                } else if (declType instanceof StructType) {
                    const declParamVar = new StructVar(identifier_name.lexeme, declType, declType.fields)
                    declParamVars.push(declParamVar)
                } else {
                    const declParamVar = new Var(identifier_name.lexeme, declType)
                    declParamVars.push(declParamVar)
                }

            } while (this.match(Tokenkind.COMMA))
        }
        return declParamVars
    }

    structStatement(): Stmt {
        const struct_name = this.consume(Tokenkind.IDENTIFIER, "Expect struct name.")//结构体名
        if (this.symbolTable.structInCurrentScope(struct_name.lexeme)) {
            this.error(struct_name, "Struct with this name already declared in this scope.")
        }
        this.consume(Tokenkind.LEFT_BRACE, "Expect '{' before struct body.")
        const struct_fields: { field: string, type: DataType }[] = []
        while (!this.check(Tokenkind.RIGHT_BRACE) && !this.isAtEnd()) {
            const field_type = this.declarationKind()//字段类型
            const field_name = this.consume(Tokenkind.IDENTIFIER, "Expect field name.")//字段名
            if (struct_fields.find(f => f.field === field_name.lexeme)) {
                this.error(field_name, "Field with this name already declared in this struct.")
            }
            struct_fields.push({ field: field_name.lexeme, type: field_type })
            while (this.match(Tokenkind.COMMA)) {
                const field_name_ = this.consume(Tokenkind.IDENTIFIER, "Expect field name.")//字段名
                if (struct_fields.find(f => f.field === field_name_.lexeme)) {
                    this.error(field_name_, "Field with this name already declared in this struct.")
                }
                struct_fields.push({ field: field_name_.lexeme, type: field_type })
            }
            this.consume(Tokenkind.SEMICOLON, "Expect ';' after field declaration.")
        }
        this.consume(Tokenkind.RIGHT_BRACE, "Expect '}' after struct body.")

        const struct_ = new StructType(struct_name.lexeme, struct_fields)
        this.symbolTable.addStructure(struct_name.lexeme, struct_)
        return new StructStmt(struct_)
    }

    printStatement(): Stmt {
        const value = this.expression()
        this.consume(Tokenkind.SEMICOLON, "Expect ';' after value.")
        return new PrintStmt(value)
    }
    expressionStatement(): Stmt {//表达式语句，由表达式+分号组成，表达式的值会被丢弃
        const value = this.expression()
        this.consume(Tokenkind.SEMICOLON, "Expect ';' after value.")
        return new ExpressionStmt(value)
    }

    returnStatement(): Stmt {
        const funcEn = this.funcEnclosing.at(-1)
        // 如果 reutrn 语句不在函数体内 则抛出错误
        if (!funcEn) {
            El.error(this.previous(), "Cannot return from top-level code.")
        }

        const keyword = this.previous()
        let value: Expr = null
        if (!this.check(Tokenkind.SEMICOLON)) {
            value = this.expression()
        }
        const retType = value ? value.exprType : new SimpleType(SimpleKind.Void) //返回值类型
        this.consume(Tokenkind.SEMICOLON, "Expect ';' after return value.")
        // funcEn.retExprType = retType
        return new ReturnStmt(keyword, value)
    }

    blockStatement(): BlockStmt {
        this.symbolTable.enterScope(ScopeType.Block)
        const statements = []
        while (!this.check(Tokenkind.RIGHT_BRACE) && !this.isAtEnd()) {
            statements.push(this.statementStmt())
        }
        this.consume(Tokenkind.RIGHT_BRACE, "Expect '}' after block.")
        this.symbolTable.leaveScope()
        return new BlockStmt(statements)
    }

    ifStatement(): IfStmt {
        this.consume(Tokenkind.LEFT_PAREN, "Expect '(' after 'if'.")
        const condition = this.expression()
        this.consume(Tokenkind.RIGHT_PAREN, "Expect ')' after if condition.")
        const thenBranch = this.statement()
        let elseBranch = null
        if (this.match(Tokenkind.ELSE)) {
            elseBranch = this.statement()
        }
        return new IfStmt(condition, thenBranch, elseBranch)
    }

    whileStatement(): WhileStmt {
        this.consume(Tokenkind.LEFT_PAREN, "Expect '(' after 'while'.")
        const condition = this.expression()
        this.consume(Tokenkind.RIGHT_PAREN, "Expect ')' after condition.")
        this.loopEnclosing.push('while')
        const body = this.statement()
        this.loopEnclosing.pop()
        return new WhileStmt(condition, body)
    }
    doWhileStatement(): DoWhileStmt {
        this.loopEnclosing.push('do-while')
        const body = this.statement()
        this.loopEnclosing.pop()
        this.consume(Tokenkind.WHILE, "Expect 'while' after 'do'.")
        this.consume(Tokenkind.LEFT_PAREN, "Expect '(' after 'while'.")
        const condition = this.expression()
        this.consume(Tokenkind.RIGHT_PAREN, "Expect ')' after condition.")
        this.consume(Tokenkind.SEMICOLON, "Expect ';' after do-while statement.")
        return new DoWhileStmt(condition, body)
    }
    forStatement(): ForStmt {
        this.symbolTable.enterScope(ScopeType.For) //进入新的作用域
        this.consume(Tokenkind.LEFT_PAREN, "Expect '(' after 'for'.")
        let initializer = null
        if (this.match(Tokenkind.SEMICOLON)) {
            initializer = null
        } else if (this.match(...this.typeKind)) {
            const kind = this.previous()
            let declType = new SimpleType(SimpleKind[kind.type])//声明 的类型
            initializer = this.varListDeclaration(declType)
        } else {
            initializer = this.expressionStatement()
        }

        let condition = null
        if (!this.check(Tokenkind.SEMICOLON)) {
            condition = this.expression()
        }
        this.consume(Tokenkind.SEMICOLON, "Expect ';' after loop condition.")

        let increment = null
        if (!this.check(Tokenkind.RIGHT_PAREN)) {
            increment = this.expression()
        }
        this.consume(Tokenkind.RIGHT_PAREN, "Expect ')' after for clauses.")
        this.loopEnclosing.push('for')
        let body = this.statement()
        this.loopEnclosing.pop()
        this.symbolTable.leaveScope()
        return new ForStmt(initializer, condition, increment, body)
    }
    loopStatement(): LoopStmt {
        this.loopEnclosing.push('loop')
        const body = this.statement()
        this.loopEnclosing.pop()
        return new LoopStmt(body)
    }
    breakStatement(): BreakStmt {
        //todo 跳出多层循环
        if (this.loopEnclosing.length === 0) {
            this.error(this.previous(), "Cannot use 'break' outside of a loop.")
        }
        this.consume(Tokenkind.SEMICOLON, "Expect ';' after 'break'.")
        return new BreakStmt()
    }
    continueStatement(): Stmt {
        this.consume(Tokenkind.SEMICOLON, "Expect ';' after 'continue'.")
        return new ContinueStmt()
    }

    //表达式
    expression(): Expr {//表达式
        this.unKnowFuncLabelExprSmt.forEach((value, key) => {
            value.forEach((funcLabelExpr, name) => {
                const funLabel = this.symbolTable.findIdentifier(name)
                if (funLabel && funLabel instanceof FunLable) {
                    funcLabelExpr.fun_lable = funLabel
                    value.delete(name)
                }
            })
            if (value.size === 0) {
                key.verify()
                this.unKnowFuncLabelExprSmt.delete(key)
            }
        })
        const expr = this.comma()
        if (this.curExprSmtUnknowFuncLabel.size > 0) {
            this.unKnowFuncLabelExprSmt.set(expr, this.curExprSmtUnknowFuncLabel)
            this.curExprSmtUnknowFuncLabel = new Map()
        } else {
            expr.verify()
        }
        return expr
    }
    // 逗号表达式 //的返回值是左值
    comma(): Expr {
        let expr = this.assignment();

        while (this.match(Tokenkind.COMMA)) {
            const right = this.assignment();
            expr = new CommaExpr(expr, right, this.previous());
        }
        return expr;
    }
    //赋值表达式
    assignment(): Expr {
        const leftExpr = this.or()
        if (this.match(Tokenkind.EQUAL)) {
            const equals = this.previous()
            const value = this.assignment()
            if (leftExpr instanceof VariableExpr) {
                if (leftExpr instanceof VariableExpr) {
                    return new AssignExpr(leftExpr, value, equals)
                } else {
                    El.error(equals, "Expression is not assignable.")
                }
            }
            if (leftExpr instanceof GetFieldExpr) {
                return new SetFieldExpr(leftExpr, value, equals)
            }
            if (leftExpr instanceof IndexExpr) {
                return new SetIndexExpr(leftExpr, value, equals)
            }
            El.error(equals, "Invalid assignment target.")
        }
        if (this.match(Tokenkind.ARROW)) {
            const arrow = this.previous()
            const value = this.assignment()
            if (leftExpr instanceof VariableExpr && (value instanceof VariableExpr || value instanceof LiteralExpr)) {
                return new ArrowExpr(leftExpr, value, arrow)
            }
            El.error(arrow, "Invalid assignment target.")
        }
        return leftExpr
    }
    or() {
        let expr = this.and()
        while (this.match(Tokenkind.OR)) {
            const operator = this.previous()
            const right = this.and()
            expr = new LogicalBinaryExpr(expr, operator, right)
        }
        return expr
    }
    and() {
        let expr = this.equality()
        while (this.match(Tokenkind.AND)) {
            const operator = this.previous()
            const right = this.equality()
            expr = new LogicalBinaryExpr(expr, operator, right)
        }
        return expr
    }

    equality(): Expr {//等于 ｜ 不等 表达式
        let expr = this.comparison()
        while (this.match(Tokenkind.EQUAL_EQUAL, Tokenkind.BANG_EQUAL)) {
            const operator = this.previous()
            const right = this.comparison()
            expr = new BinaryExpr(expr, operator, right)
        }
        return expr
    }
    comparison(): Expr {//比较表达式
        let expr = this.term()
        while (this.match(Tokenkind.GREATER, Tokenkind.GREATER_EQUAL, Tokenkind.LESS, Tokenkind.LESS_EQUAL)) {
            const operator = this.previous()
            const right = this.term()
            expr = new BinaryExpr(expr, operator, right)
        }
        return expr

    }
    term(): Expr {//+ - 运算 表达式
        let expr = this.factor()//加减运算的优先级 小于 乘除运算；所以加减运算的左操作数是乘除表达式
        while (this.match(Tokenkind.PLUS, Tokenkind.MINUS)) {
            const operator = this.previous();
            const right = this.factor()
            expr = new BinaryExpr(expr, operator, right)
        }
        return expr
    }
    factor(): Expr {// * / 运算 表达式
        let expr = this.unary()//左操作数
        while (this.match(Tokenkind.SLASH, Tokenkind.STAR)) {//match会使得 游标前进一步
            const operator = this.previous()//操作符
            const right = this.unary()
            expr = new BinaryExpr(expr, operator, right)
        }
        return expr
    }
    unary(): Expr {//一元表达式 
        if (this.match(Tokenkind.BANG, Tokenkind.MINUS, Tokenkind.PLUS)) {
            const operator = this.previous()
            const expr = this.unary()
            return new UnaryExpr(operator, expr)
        }
        return this.prefix()
    }


    prefix(): Expr {
        if (this.match(Tokenkind.PLUS_PLUS, Tokenkind.MINUS_MINUS)) {
            const operator = this.previous()
            const expr = this.postfix()
            return new PrefixSelfExpr(operator, expr)
        }
        return this.postfix()
    }

    postfix() {//后缀表达式
        let expr = this.primary()
        // 循环解析后缀操作，直到无法匹配后缀为止
        while (true) {
            if (this.match(Tokenkind.LEFT_PAREN)) {
                expr = this.functionCall(expr)
            }
            else if (this.match(Tokenkind.DOT)) {
                const field_name = this.consume(Tokenkind.IDENTIFIER, "Expect field name.")//字段名
                expr = new GetFieldExpr(expr, field_name.lexeme, this.previous())
            }
            else if (this.match(Tokenkind.LEFT_BRACKET)) {
                const index = this.assignment()
                this.consume(Tokenkind.RIGHT_BRACKET, "Expect ']' after index.")
                expr = new IndexExpr(expr, index, this.previous())
            }
            else if (this.match(Tokenkind.PLUS_PLUS, Tokenkind.MINUS_MINUS)) {
                const operator = this.previous()
                expr = new SuffixSelfExpr(expr, operator)
            } else {
                break
            }
        }
        return expr
    }

    functionCall(callee: Expr): Expr {
        const args = []
        if (!this.check(Tokenkind.RIGHT_PAREN)) {
            do {
                if (args.length >= 255) {
                    this.error(this.peek(), "Can't have more than 255 arguments.")
                }
                args.push(this.assignment())
            } while (this.match(Tokenkind.COMMA))
        }
        // 记录右括号的位置以便定位错误
        const paren = this.consume(Tokenkind.RIGHT_PAREN, "Expect ')' after arguments.")
        return new CallExpr(callee, paren, args)
    }

    primary(): Expr { //主表达式 =>字面量，this ， boolean ，标识符(变量名)
        if (this.match(Tokenkind.NUMBER, Tokenkind.STRING, Tokenkind.CHARACTER, Tokenkind.TRUE, Tokenkind.FALSE, Tokenkind.NULL)) {
            return new LiteralExpr(this.previous()); //字面量 表达式
        }
        if (this.match(Tokenkind.LEFT_PAREN)) {

            const params = this.paramDeclaration()
            if (this.peek().type == Tokenkind.RIGHT_PAREN || params.length > 0) {
                this.consume(Tokenkind.RIGHT_PAREN, "Expect ')' after expression.")
                const decRetType = this.declarationKind()
                const funcEn: FuncEnclosing = {
                    funcName: 'anonymous',
                    params: params,
                    dclRetType: decRetType
                }
                this.funcEnclosing.push(funcEn)
                this.symbolTable.enterScope(ScopeType.Function)
                params.forEach(item => {
                    this.symbolTable.addIdentifier(item.name, item)
                })

                this.consume(Tokenkind.LEFT_BRACE, "Expect '{' before function body.")
                const bodyStatements: Stmt[] = []
                while (!this.check(Tokenkind.RIGHT_BRACE) && !this.isAtEnd()) {
                    bodyStatements.push(this.statementStmt())
                }
                this.consume(Tokenkind.RIGHT_BRACE, "Expect '}' after function block.")
                if (!(bodyStatements.at(-1) instanceof ReturnStmt)) {
                    if (decRetType instanceof SimpleType && decRetType.simpleKind === SimpleKind.Void) {
                        bodyStatements.push(new ReturnStmt(new Token(Tokenkind.RETURN, "return", null, this.previous().line), null))
                    } else {
                        this.error(this.previous(), "Function must have a return value.")
                    }
                }
                this.symbolTable.leaveScope()
                this.funcEnclosing.pop()

                const fun_lable = new FunLable("anonymous", new FunType(params.map(item => item.type), decRetType))
                return new FunctionExpr(fun_lable, this.previous(), bodyStatements, params)

            } else {
                const expr = this.expression()
                this.consume(Tokenkind.RIGHT_PAREN, "Expect ')' after expression.")
                return new GroupingExpr(expr, this.previous())
            }
        }
        if (this.match(Tokenkind.IDENTIFIER)) {
            const var_ = this.previous()
            let varName = var_.lexeme

            const idne = this.symbolTable.findIdentifier(varName)
            if (idne instanceof FunLable) {
                return new FunctionExpr(idne, var_)
            } else if (idne instanceof Var) {
                return new VariableExpr(idne, var_)
            } else {
                const varExpr = new FunctionExpr(null, var_)
                this.curExprSmtUnknowFuncLabel.set(varName, varExpr)
                return varExpr
            }
        }

        if (this.match(Tokenkind.LEFT_BRACE)) {
            const fields: { field: string, value: Expr }[] = []
            while (!this.check(Tokenkind.RIGHT_BRACE) && !this.isAtEnd()) {
                const field_name = this.consume(Tokenkind.IDENTIFIER, "Expect field name.")//字段名
                this.consume(Tokenkind.COLON, "Expect ':' after field name.")
                const field_value = this.assignment()
                if (fields.find(f => f.field === field_name.lexeme)) {
                    this.error(field_name, "Field with this name already declared in this struct.")
                }
                fields.push({ field: field_name.lexeme, value: field_value })
                if (this.peek().type !== Tokenkind.RIGHT_BRACE) {
                    this.consume(Tokenkind.COMMA, "Expect ',' after field declaration.")
                }
            }
            this.consume(Tokenkind.RIGHT_BRACE, "Expect '}' after struct expression.")
            // const structType = this.symbolTable.finddStructure(fields.map(f => ({ name: f.field, val_type: f.value.exprType })))
            // if (!structType) {
            //     this.error(this.peek(), "Struct with this name not declared.")
            // }
            return new StructExpr(fields, this.previous())
        }

        // 数组表达式
        if (this.match(Tokenkind.LEFT_BRACKET)) {
            const elements = []
            let exprType: "array" | "tuple" = "array"
            let lastEleType: DataType = null
            while (!this.check(Tokenkind.RIGHT_BRACKET) && !this.isAtEnd()) {
                const ele = this.assignment()
                elements.push(ele)
                if (this.peek().type !== Tokenkind.RIGHT_BRACKET) {
                    this.consume(Tokenkind.COMMA, "Expect ',' after array or tuple element.")
                }
               
                if (lastEleType !== null) {
                    if (!isSameType(lastEleType, elements.at(-1).exprType)) {
                        exprType = "tuple"
                    }
                }
                lastEleType = elements.at(-1).exprType
            }
            this.consume(Tokenkind.RIGHT_BRACKET, "Expect ']' after array length.")
            if (exprType === "array") {
                return new ArrayExpr(elements, this.previous())
            } else {
                return new TupleExpr(elements, this.previous())
            }
        }

        throw this.error(this.peek(), "Expect expression.");
    }




    //工具
    match(...kinds: Tokenkind[]) {//匹配到 TokenKind时，当前token 应该被消费，游标前进
        for (const kind of kinds) {
            if (this.check(kind)) {
                this.advance()
                return true
            }
        }
        return false
    }

    private advance() {
        if (!this.isAtEnd()) {
            this.current++
        }
        return this.previous()
    }

    //回退到指定位置
    private back(i: number) {
        this.current = i
    }

    private check(kind: Tokenkind) {
        if (this.isAtEnd()) {
            return false
        }
        return this.peek().type == kind
    }
    private isAtEnd() {
        return this.peek().type == Tokenkind.EOF
    }
    private peek(): Token {
        return this.tokens[this.current]
    }
    private peekNext() { //往前多看一个token
        if (this.isAtEnd()) {
            return null
        }
        return this.tokens[this.current + 1]
    }
    private previous() {//上一个token
        return this.tokens[this.current - 1];
    }


    // 错误同步
    consume(kind: Tokenkind, message: string) {//消费当前token，如果不是kind类型的token，抛出异常
        if (this.check(kind)) {
            return this.advance()
        }
        throw this.error(this.peek(), "Expect " + kind)
    }
    private error(token: Token, message: string) {
        El.error(token, message)
        return new ParseError("Parser error." + message);
    }
    synchronize() {
        this.advance()
        while (!this.isAtEnd()) {
            if (this.previous().type == Tokenkind.SEMICOLON) {
                return
            }
            switch (this.peek().type) {
                // case Tokenkind.CLASS:
                case Tokenkind.FOR:
                case Tokenkind.IF:
                case Tokenkind.WHILE:
                case Tokenkind.PRINT:
                case Tokenkind.RETURN:
                    return;
            }
            this.advance()
        }
    }



}

export class ParseError extends Error { }