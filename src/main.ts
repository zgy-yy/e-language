import { AstPrinter } from "./Ast/AstPrinter"
import { Scanner } from "./Lexer/Lexer"
import { Token, Tokenkind } from "./Lexer/Token"
import { Parser } from "./Parse/Parse"

const code =`4>3==53+41*3/2>8`

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

