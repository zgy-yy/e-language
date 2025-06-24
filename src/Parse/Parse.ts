import { AssignExpr, BinaryExpr, CallExpr, CommaExpr, Expr, GroupingExpr, LiteralExpr, LogicalBinaryExpr, SuffixSelfExpr, UnaryExpr, VariableExpr } from "../Ast/Expr";
import { BlockStmt, BreakStmt, ContinueStmt, DoWhileStmt, ExpressionStmt, ForStmt, FunctionStmt, IfStmt, PrintStmt, ReturnStmt, Stmt, VarListStmt, VarStmt, WhileStmt } from "../Ast/Stmt";
import { El } from "../El/El";
import { Token, Tokenkind, VarType } from "../Lexer/Token";
import { SymbolTable } from "./SymbolTable";
import { ParamVar, Var } from "./Symbol";

export class Parser {
    tokens: Token[]
    current: number = 0;//tokens 游标

    symbolTable: SymbolTable = new SymbolTable();//符号表 

    typeKind = [Tokenkind.INT, Tokenkind.CHAR, Tokenkind.VOID]

    constructor(tokens: Token[]) {
        this.tokens = tokens
    }

    parse() {//解析程序
        const statements = [];//语句
        while (!this.isAtEnd()) {
            statements.push(this.declaration())//程序由多个声明语句组成
        }
        return { //返回程序的抽象语法树，包含变量表和语句
            stmt: statements
        }
    }

    //语句
    // 程序语句 declaration -> varDeclaration | functionDeclaration 
    declaration(): Stmt {
        try {
            if (this.match(...this.typeKind)) {
                let kind = this.previous()//声明的类型
                let declType = VarType[kind.type]//声明 的类型
                this.consume(Tokenkind.IDENTIFIER, "Expect identifier name.") //标识符名称;声明语句 必须要一个标识符
                if (this.peek().type == Tokenkind.LEFT_PAREN) {
                    return this.funcDeclaration(declType)
                }
                return this.varListDeclaration(declType)
            }
            // this.statement ()
            throw this.error(this.peek(), "Expect declaration.")
        } catch (error) {
            if (error instanceof ParseError) {
                this.synchronize()
            } else {
                throw error
            }
        }
    }

    /* 语句 statement -> printStatement | block | ifStatement | whileStatement | doWhileStatement | forStatement 
                        | breakStatement | continueStatement | expressionStatement
                        ｜ declaration
     */
    statement(): Stmt {
        if (this.match(Tokenkind.PRINT))
            return this.printStatement()
        if (this.match(Tokenkind.LEFT_BRACE))
            return new BlockStmt(this.block())
        if (this.match(Tokenkind.IF))
            return this.ifStatement()
        if (this.match(Tokenkind.WHILE))
            return this.whileStatement()
        if (this.match(Tokenkind.Do))
            return this.doWhileStatement()
        if (this.match(Tokenkind.FOR))
            return this.forStatement()
        if (this.match(Tokenkind.BREAK))
            return this.breakStatement()
        if (this.match(Tokenkind.CONTINUE))
            return this.continueStatement()
        if (this.match(Tokenkind.RETURN))
            return this.returnStatement()

        if (this.match(...this.typeKind)) {
            let kind = this.previous()//声明的类型
            let declType = VarType[kind.type]//声明 的类型
            this.consume(Tokenkind.IDENTIFIER, "Expect identifier name.") //标识符名称
            if (this.peek().type == Tokenkind.LEFT_PAREN) {
                return this.funcDeclaration(declType)
            }
            return this.varListDeclaration(declType)
        }

        return this.expressionStatement()
    }

    //变量声明语句
    varListDeclaration(varT: VarType): Stmt {
        let varStmt: VarStmt[] = []
        const var_name = this.previous()//变量名
        if (this.symbolTable.inCurrentScope(var_name.lexeme)) {
            this.error(var_name, "Variable with this name already declared in this scope.")
        }
        const var_ = new Var(var_name.lexeme, varT)
        this.symbolTable.addVariable(var_name.lexeme, var_)

        let initializer = null
        if (this.match(Tokenkind.EQUAL)) {
            initializer = this.assignment()//初始化表达式 不能包含 逗号表达式
        }
        varStmt.push(new VarStmt(var_, initializer))

        while (this.match(Tokenkind.COMMA)) {
            let var_name = this.consume(Tokenkind.IDENTIFIER, "Expect identifier name.") //标识符名称
            if (this.symbolTable.inCurrentScope(var_name.lexeme)) {
                this.error(var_name, "Variable with this name already declared in this scope.")
            }
            const var_ = new Var(var_name.lexeme, VarType.Int)
            this.symbolTable.addVariable(var_name.lexeme, var_)
            let initializer = null
            if (this.match(Tokenkind.EQUAL)) {
                initializer = this.assignment()
            }
            varStmt.push(new VarStmt(var_, initializer))
        }
        this.consume(Tokenkind.SEMICOLON, "Expect ';' after variable declaration.")
        return new VarListStmt(varStmt)
    }

    paramDeclaration(): Var {
        if (this.match(...this.typeKind)) {
            let kind = this.previous()//声明的类型
            let declType: VarType = VarType[kind.type]//声明 的类型
            let identifier_name = this.consume(Tokenkind.IDENTIFIER, "Expect identifier name.") //标识符名称
            if (this.symbolTable.inCurrentScope(identifier_name.lexeme)) {
                this.error(identifier_name, "Paramter Variable with this name already declared in this scope.")
            }
            const declParamVar = new ParamVar(identifier_name.lexeme, declType)
            this.symbolTable.addVariable(identifier_name.lexeme, declParamVar)
            return declParamVar
        }
    }
    //函数声明
    // functionDeclaration -> type IDENTIFIER "(" parameters? ")" block
    funcDeclaration(reType: VarType): Stmt {
        this.symbolTable.enterScope()
        const fun_name = this.previous()//函数名
        this.consume(Tokenkind.LEFT_PAREN, "Expect '(' after function name.")
        const params: Var[] = []
        if (!this.check(Tokenkind.RIGHT_PAREN)) {
            do {
                if (params.length >= 255) {
                    this.error(this.peek(), "Can't have more than 255 parameters.")
                }
                params.push(this.paramDeclaration())
            } while (this.match(Tokenkind.COMMA))
        }
        this.consume(Tokenkind.RIGHT_PAREN, "Expect ')' after parameters.")
        this.consume(Tokenkind.LEFT_BRACE, "Expect '{' before function body.")
        const body = this.block()
        const fun_var = new Var(fun_name.lexeme, VarType.Fun) //函数声明 视为变量
        this.symbolTable.addVariable(fun_name.lexeme, fun_var)//将函数名加入符号表
        this.symbolTable.leaveScope()
        return new FunctionStmt(reType, fun_var, params, new BlockStmt(body))
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
        const keyword = this.previous()
        let value = null
        if (!this.check(Tokenkind.SEMICOLON)) {
            value = this.expression()
        }
        this.consume(Tokenkind.SEMICOLON, "Expect ';' after return value.")
        return new ReturnStmt(keyword, value)
    }

    block(): Stmt[] {
        this.symbolTable.enterScope()
        const statements = []
        while (!this.check(Tokenkind.RIGHT_BRACE) && !this.isAtEnd()) {
            statements.push(this.statement())
        }
        this.consume(Tokenkind.RIGHT_BRACE, "Expect '}' after block.")
        this.symbolTable.leaveScope()
        return statements
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

    whileStatement() {
        this.consume(Tokenkind.LEFT_PAREN, "Expect '(' after 'while'.")
        const condition = this.expression()
        this.consume(Tokenkind.RIGHT_PAREN, "Expect ')' after condition.")
        const body = this.statement()
        return new WhileStmt(condition, body)
    }
    doWhileStatement() {
        const body = this.statement()
        this.consume(Tokenkind.WHILE, "Expect 'while' after 'do'.")
        this.consume(Tokenkind.LEFT_PAREN, "Expect '(' after 'while'.")
        const condition = this.expression()
        this.consume(Tokenkind.RIGHT_PAREN, "Expect ')' after condition.")
        this.consume(Tokenkind.SEMICOLON, "Expect ';' after do-while statement.")
        return new DoWhileStmt(condition, body)
    }
    forStatement() {
        this.symbolTable.enterScope() //进入新的作用域
        this.consume(Tokenkind.LEFT_PAREN, "Expect '(' after 'for'.")
        let initializer = null
        if (this.match(Tokenkind.SEMICOLON)) {
            initializer = null
        } else if (this.match(Tokenkind.INT)) {
            initializer = this.statement()
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
        let body = this.statement()
        this.symbolTable.leaveScope()
        return new ForStmt(initializer, condition, increment, body)
        //脱糖
        // if (increment != null) {
        //     body = new BlockStmt([body, new ExpressionStmt(increment)])
        // }
        // if (condition == null) {
        //     condition = new LiteralExpr(1)
        // }
        // body = new WhileStmt(condition, body)
        // if (initializer != null) {
        //     body = new BlockStmt([initializer, body])
        // }
        // return body
    }
    breakStatement(): BreakStmt {
        this.consume(Tokenkind.SEMICOLON, "Expect ';' after 'break'.")
        return new BreakStmt()
    }
    continueStatement(): Stmt {
        this.consume(Tokenkind.SEMICOLON, "Expect ';' after 'continue'.")
        return new ContinueStmt()
    }

    //表达式
    expression(): Expr {//表达式
        return this.comma()
    }
    // 逗号表达式 //的返回值是左值
    comma(): Expr {
        let expr = this.assignment();

        while (this.match(Tokenkind.COMMA)) {
            const right = this.assignment();
            expr = new CommaExpr(expr, right);
        }
        return expr;
    }
    //赋值表达式
    assignment(): Expr {
        const expr = this.or()//表达式得出左值
        if (this.match(Tokenkind.EQUAL)) {
            const equals = this.previous()
            const value = this.assignment()
            if (expr instanceof VariableExpr) {
                return new AssignExpr(expr.variable, value)
            }
            El.error(equals, "Invalid assignment target.")
        }
        return expr
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

    equality() {//等于 ｜ 不等 表达式
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
            const right = this.unary()
            return new UnaryExpr(operator, right)
        }
        let expr = this.postfix()

        return expr
    }
    postfix() {//后缀表达式
        let expr = this.primary()
        // 循环解析后缀操作，直到无法匹配后缀为止
        while (true) {
            if (this.match(Tokenkind.LEFT_PAREN)) {
                expr = this.functionCall(expr)
            }
            // else if (this.match(Tokenkind)) {
            //     const index = this.expression()
            //     this.consume(Tokenkind.RIGHT_BRACKET, "Expect ']' after index.")
            //     expr = new IndexExpr(expr, index)
            // } 
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
        if (this.match(Tokenkind.NUMBER, Tokenkind.STRING, Tokenkind.CHARACTER)) {
            return new LiteralExpr(this.previous().literal); //字面量 表达式
        }
        if (this.match(Tokenkind.LEFT_PAREN)) {
            const expr = this.expression()
            this.consume(Tokenkind.RIGHT_PAREN, "Expect ')' after expression.")
            return new GroupingExpr(expr)
        }
        if (this.match(Tokenkind.IDENTIFIER)) {
            // if (this.peek().type == Tokenkind.LEFT_PAREN) {
            //     return new VariableExpr(new Var(this.previous().lexeme, VarType.Fun))
            // }
            const varExpr = this.previous()
            let varName = varExpr.lexeme
            if (this.symbolTable.findVariable(varName)) {
                return new VariableExpr(this.symbolTable.findVariable(varName))
            }

            throw this.error(varExpr, "Undefined variable '" + varName + "'.")
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