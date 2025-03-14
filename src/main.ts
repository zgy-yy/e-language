import { AstPrinter } from "./Ast/AstPrinter"
import { CodeGen } from "./CodeGen/CodeGen"
import { Scanner } from "./Lexer/Lexer"
import { Parser } from "./Parse/Parse"

const code =`3+-+4`

function main() {
    const sanner = new Scanner(code)
    const tokens = sanner.scanTokens()
    console.log(tokens)

  
    // new AstPrinter().print(expression)
    const parser = new Parser(tokens)
   
    const statements = parser.parse()
    console.log('zz', statements)
    
    const codeGen = new CodeGen()
    codeGen.generateCode(statements[0])
    new AstPrinter().print(statements[0])
}

console.log('main',1)

main()

