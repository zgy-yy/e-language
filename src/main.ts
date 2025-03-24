import { AstPrinter } from "./Ast/AstPrinter"
import { CodeGen } from "./CodeGen/CodeGen"
import { Scanner } from "./Lexer/Lexer"
import { Parser } from "./Parse/Parse"

const code = 
`
int a=15;
if(a>10){
print 1;
}
else{
print 2;
}
 `

function main() {
    const sanner = new Scanner(code)
    const tokens = sanner.scanTokens()
    console.log(tokens)

  
    // new AstPrinter().print(expression)
    const parser = new Parser(tokens)
   
    const program = parser.parse()
    console.log('zz', program)
    
   let astPrint = new AstPrinter()
    astPrint.print(program.stmt)

    const codeGen = new CodeGen()
    codeGen.generateCode(program)
    new AstPrinter().print(program.stmt)
}

console.log('code -> \n', code)

main()
