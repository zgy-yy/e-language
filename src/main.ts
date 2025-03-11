import { AstPrinter } from "./Ast/AstPrinter"
import { BinaryExpr, LiteralExpr } from "./Ast/Expr"
import { Scanner } from "./Lexer/Lexer"
import { Token, Tokenkind } from "./Lexer/Token"
import { Parser } from "./Parse/Parse"

const code =`53+41*3/2`

function main() {
    const sanner = new Scanner(code)
    const tokens = sanner.scanTokens()
    console.log(tokens)

  
    // new AstPrinter().print(expression)
    const parser = new Parser(tokens)
   
    const statements = parser.parse()
    console.log('zz', statements)
    
    new AstPrinter().print(statements[0])
}

main()