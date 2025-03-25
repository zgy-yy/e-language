import { AssignExpr, BinaryExpr, Expr, GroupingExpr, LiteralExpr, LogicalBinaryExpr, UnaryExpr, VariableExpr } from "../Ast/Expr";
import { BlockStmt, DoWhileStmt, ExpressionStmt, IfStmt, PrintStmt, Stmt, VarStmt, WhileStmt } from "../Ast/Stmt";
import { El } from "../El/El";
import { Token, Tokenkind, VarType } from "../Lexer/Token";
import { SymbolTable } from "./SymbolTable";
import { Var } from "./Symbol";

export class Parser {
    tokens: Token[]
    current: number = 0;//tokens 游标

    symbolTable :SymbolTable = new SymbolTable();//符号表
    locals:Var[] = [];//局部变量 

    constructor(tokens: Token[]) {
        this.tokens = tokens
    }

    parse() {
        this.symbolTable.enterScope()
        const statements = [];//语句
        while (!this.isAtEnd()) {
            statements.push(this.declaration())
        }
        this.symbolTable.leaveScope()
        return { //返回程序的抽象语法树，包含变量表和语句
            localVars : this.locals,
            stmt:statements
        }
    }

    //语句

    declaration(): Stmt {
        try {
            if (this.match(Tokenkind.INT)) {
                return this.varDeclaration(VarType.int)
            }
            if (this.match(Tokenkind.CHAR)) {
                return this.varDeclaration(VarType.char)
            }
            return this.statement()
        } catch (error) {
            if (error instanceof ParseError) {
                this.synchronize()
            }
            return null
        }
    }


    statement(): Stmt {
        if (this.match(Tokenkind.PRINT)) 
            return this.printStatement()
        if(this.match(Tokenkind.LEFT_BRACE))
            return new BlockStmt(this.block())
        if(this.match(Tokenkind.IF))
            return this.ifStatement()
        if(this.match(Tokenkind.WHILE))
            return this.whileStatement()
        if (this.match(Tokenkind.Do))
            return this.doWhileStatement()
        // if(this.match(Tokenkind.FOR))
            // return this.forStatement()
        
        return this.expressionStatement()
    }

    //变量声明语句
    varDeclaration(varT:VarType): Stmt{ 
        const name = this.consume(Tokenkind.IDENTIFIER, "Expect variable name.")
        if (this.symbolTable.findVariable(name.lexeme)) {
            this.error(name, "Variable with this name already declared in this scope.")
        }
        const var_ = new Var(name.lexeme, varT)
        this.symbolTable.addVariable(name.lexeme, var_)
        this.locals.push(var_)
        
        let initializer = null
        if (this.match(Tokenkind.EQUAL)) {
            initializer = this.expression()
        }
        this.consume(Tokenkind.SEMICOLON, "Expect ';' after variable declaration.")
        return new VarStmt(var_, initializer)
    }

    printStatement(): Stmt{
        const value = this.expression()
        this.consume(Tokenkind.SEMICOLON, "Expect ';' after value.")
        return new PrintStmt(value)
    }
    expressionStatement(): Stmt{//表达式语句，由表达式+分号组成，表达式的值会被丢弃
        const value = this.expression()
        this.consume(Tokenkind.SEMICOLON, "Expect ';' after value.")
        return new ExpressionStmt(value)
    }

    block(): Stmt[] {
        this.symbolTable.enterScope()
        const statements = []
        while (!this.check(Tokenkind.RIGHT_BRACE) && !this.isAtEnd()) {
            statements.push(this.declaration())
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

    //表达式
    expression(): Expr {//表达式
        return this.assignment()
    }
    //赋值表达式
    assignment(): Expr {
        const expr = this.or()//表达式得出左值
        if (this.match(Tokenkind.EQUAL)) {
            const equals = this.previous()
            const value = this.assignment()
            if (expr instanceof VariableExpr) {
                return new AssignExpr(expr.variable,  value)
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
    comparison():Expr {//比较表达式
        let expr = this.term()
        while (this.match(Tokenkind.GREATER, Tokenkind.GREATER_EQUAL, Tokenkind.LESS, Tokenkind.LESS_EQUAL)) {
            const operator = this.previous()
            const right = this.term()
            expr = new BinaryExpr(expr, operator, right)
        }
        return expr
    
    }
    term():Expr {//+ - 运算 表达式
        let expr = this.factor()//加减运算的优先级 小于 乘除运算；所以加减运算的左操作数是乘除表达式
        while (this.match(Tokenkind.PLUS, Tokenkind.MINUS)) {
            const operator = this.previous();
            const right = this.factor()
            expr = new BinaryExpr(expr,operator,right)
        }
        return expr
    }
    factor():Expr{// * / 运算 表达式
        let expr = this.unary()//左操作数
        while (this.match(Tokenkind.SLASH, Tokenkind.STAR)) {//match会使得 游标前进一步
            const operator = this.previous()//操作符
            const right = this.unary()
            expr = new BinaryExpr(expr,operator,right)
        }
        return expr
    }
    unary():Expr {//一元表达式 
        if (this.match(Tokenkind.BANG, Tokenkind.MINUS, Tokenkind.PLUS)) {
            const operator = this.previous()
            const right = this.unary()
            return new UnaryExpr(operator, right)
        }
        return this.primary()
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
            const varExpr = this.previous()
            let varName = varExpr.lexeme
            if (this.symbolTable.findVariable(varName)) {
                return new VariableExpr(this.symbolTable.findVariable(varName))
            }
          throw  this.error(varExpr, "Undefined variable '" + varName + "'.")
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
                // case Tokenkind.FUN:
                // case Tokenkind.VAR:
                // case Tokenkind.FOR:
                // case Tokenkind.IF:
                // case Tokenkind.WHILE:
                // case Tokenkind.PRINT:
                // case Tokenkind.RETURN:
                    // return
            }
            this.advance()
        }
    }

    

}

export class ParseError extends Error { }