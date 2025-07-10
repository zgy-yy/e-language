import { AstPrinter } from "./Ast/AstPrinter"
import { CodeGen } from "./CodeGen/CodeGen"
import { Scanner } from "./Lexer/Lexer"
import { Parser } from "./Parse/Parse"

let code =""

async function main() {
    const text_file_path = './test/print.e'
    const text_file_url = `${text_file_path}?raw`
    // 读取测试文件
    if (checkEnv() == 'node') {
        const fs = await import('fs')
        const path = await import('path')
        let sourceCodePath = path.resolve(__dirname,text_file_path)
        const sourceCode = fs.readFileSync(sourceCodePath, 'utf-8')
        code = sourceCode
    } else {
        const file = await import(text_file_url)
        code = file.default
    }
    


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
    if (checkEnv() == 'node') {
        const fs = await import('fs')
        const path = await import('path')
        let asmPath = path.resolve(__dirname, '../llvm/index.ll')
        console.log('asmPath', asmPath)
        fs.writeFileSync(asmPath, asmText)
    }
}


main()


function checkEnv(): 'node' | 'browser' {
    const nodeEnv = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
    if (nodeEnv) {
        return 'node'
    }
    return 'browser'
}