import { AstPrinter } from "./Ast/AstPrinter"
import { CodeGen } from "./CodeGen/CodeGen"
import { Scanner } from "./Lexer/Lexer"
import { Parser } from "./Parse/Parse"

const code = 
`
int a=2;
a =a++;
for(int i=0;i<10;i++){
    print i;
}
print a;
 `

async function main() {
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
    const asmText = codeGen.generateCode(program)
    // 判断是否是node环境
    const nodeEnv = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
    if(nodeEnv){
        const fs = await import('fs')
        const path =await import('path')
        let asmPath = path.resolve(__dirname, '../asm/index.asm')
        console.log('asmPath', asmPath)
        fs.writeFileSync(asmPath, asmText)
    }
}

console.log('code -> \n', code)


main()
