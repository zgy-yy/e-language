import { Token, Tokenkind } from "../Lexer/Token";


export class El{
    static hadError = false;
    static error(token: Token, message: string) {
        if(token.type ===Tokenkind.EOF){
          El.report(token.line, " at end", message);
        }else{
            El.report(token.line, " at '" + token.lexeme + "'", message);
        }
        return new Error("Parser error." + message);
    }
    static report(line: number, where: string, message: string) {
        console.log(`[line ${line}] Error ${where}: ${message}`);
        El.hadError = true;
    }
}