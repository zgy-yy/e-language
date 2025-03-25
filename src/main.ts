import { AstPrinter } from "./Ast/AstPrinter"
import { CodeGen } from "./CodeGen/CodeGen"
import { Scanner } from "./Lexer/Lexer"
import { Parser } from "./Parse/Parse"

const code = 
`
int a = 1;
do{
    print(a);
    a = a + 1;
}while(a < 2);

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


