#!/usr/bin/env node
/**
 * LLVM IR 格式化工具
 * 自动格式化LLVM IR代码，添加适当的缩进、空行和注释
 */

import * as fs from 'fs';
import * as path from 'path';

// 类型定义
interface FormatterOptions {
    indentSize: number;
    commentStyle: 'chinese' | 'english';
}

interface CommandLineArgs {
    input: string;
    output?: string;
    indent?: number;
    commentStyle?: 'chinese' | 'english';
    inPlace?: boolean;
}

class LLVMIRFormatter {
    private options: FormatterOptions;

    constructor(options: FormatterOptions) {
        this.options = options;
    }

    /**
     * 格式化LLVM IR代码
     */
    formatLLVMIR(content: string): string {
        const lines = content.split('\n');
        const formattedLines: string[] = [];

        // 处理每一行
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const strippedLine = line.trim();

            // 跳过空行
            if (!strippedLine) {
                formattedLines.push('');
                continue;
            }

            // 处理注释行
            if (strippedLine.startsWith(';')) {
                formattedLines.push(this.formatComment(strippedLine));
                continue;
            }

            // 处理标签行
            if (this.isLabel(strippedLine)) {
                formattedLines.push(this.formatLabel(strippedLine));
                continue;
            }

            // 处理指令行
            formattedLines.push(this.formatInstruction(strippedLine, i, lines));
        }

        return formattedLines.join('\n');
    }

    /**
     * 判断是否为标签行
     */
    private isLabel(line: string): boolean {
        return /^[a-zA-Z_][a-zA-Z0-9_]*:/.test(line);
    }

    /**
     * 格式化注释行
     */
    private formatComment(line: string): string {
        // 移除开头的分号和空格
        const comment = line.replace(/^;+/, '').trim();

        // 添加中文注释
        if (this.options.commentStyle === 'chinese') {
            const commentMap: Record<string, string> = {
                '目标平台': '目标平台',
                'declare': '声明',
                'define': '定义',
                'alloca': '分配',
                'store': '存储',
                'load': '加载',
                'icmp': '比较',
                'br': '跳转',
                'call': '调用',
                'ret': '返回',
                'constant': '常量',
                'private': '私有',
                'unnamed_addr': '未命名地址',
                'getelementptr': '获取元素指针',
                'inbounds': '边界内'
            };

            for (const [eng, chn] of Object.entries(commentMap)) {
                if (comment.toLowerCase().includes(eng.toLowerCase())) {
                    return `; ${comment}`;
                }
            }
        }

        return `; ${comment}`;
    }

    /**
     * 格式化标签行
     */
    private formatLabel(line: string): string {
        return line;
    }

    /**
     * 格式化指令行
     */
    private formatInstruction(line: string, lineIndex: number, allLines: string[]): string {
        // 计算缩进级别
        const indentLevel = this.calculateIndentLevel(line, lineIndex, allLines);
        const indent = ' '.repeat(indentLevel * this.options.indentSize);

        // 添加指令注释
        const comment = this.getInstructionComment(line);
        if (comment) {
            return `${indent}${line}  ; ${comment}`;
        } else {
            return `${indent}${line}`;
        }
    }

    /**
     * 计算缩进级别
     */
    private calculateIndentLevel(line: string, lineIndex: number, allLines: string[]): number {
        // 基本缩进规则
        if (line.startsWith('define')) {
            return 0;
        } else if (line.startsWith('entry:')) {
            return 0;
        } else if (line.startsWith('if') && line.endsWith(':')) {
            return 0;
        } else if (line.startsWith('else') && line.endsWith(':')) {
            return 0;
        } else if (line.startsWith('end') && line.endsWith(':')) {
            return 0;
        } else {
            // 在函数定义内的指令
            return 1;
        }
    }

    /**
     * 获取指令的中文注释
     */
    private getInstructionComment(line: string): string {
        if (this.options.commentStyle !== 'chinese') {
            return '';
        }

        const commentMap: Record<string, string> = {
            'alloca': '分配局部变量',
            'store': '存储值到变量',
            'load': '加载变量值',
            'icmp sgt': '比较大于',
            'icmp slt': '比较小于',
            'icmp sge': '比较大于等于',
            'icmp sle': '比较小于等于',
            'icmp eq': '比较等于',
            'icmp ne': '比较不等于',
            'br label': '跳转到标签',
            'br i1': '条件跳转',
            'call': '函数调用',
            'ret': '返回',
            'getelementptr': '获取数组元素指针'
        };

        for (const [pattern, comment] of Object.entries(commentMap)) {
            if (line.includes(pattern)) {
                return comment;
            }
        }

        return '';
    }

    /**
     * 添加区块注释
     */
    addSectionComments(content: string): string {
        const lines = content.split('\n');
        const formattedLines: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const strippedLine = line.trim();

            // 在函数定义前添加注释
            if (strippedLine.startsWith('define')) {
                if (i > 0 && lines[i - 1].trim() !== '') {
                    formattedLines.push('');
                }
                formattedLines.push('; 函数定义');
                formattedLines.push(line);
                continue;
            }

            // 在标签前添加注释
            if (this.isLabel(strippedLine) && !strippedLine.startsWith('entry:')) {
                if (i > 0 && lines[i - 1].trim() !== '') {
                    formattedLines.push('');
                }
                formattedLines.push(line);
                continue;
            }

            formattedLines.push(line);
        }

        return formattedLines.join('\n');
    }
}

/**
 * 解析命令行参数
 */
function parseArgs(): CommandLineArgs {
    const args = process.argv.slice(2);
    const parsedArgs: CommandLineArgs = {
        input: ''
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        
        switch (arg) {
            case '-o':
            case '--output':
                parsedArgs.output = args[++i];
                break;
            case '--indent':
                parsedArgs.indent = parseInt(args[++i]);
                break;
            case '--comment-style':
                const style = args[++i];
                if (style === 'chinese' || style === 'english') {
                    parsedArgs.commentStyle = style;
                }
                break;
            case '--in-place':
                parsedArgs.inPlace = true;
                break;
            case '-h':
            case '--help':
                printHelp();
                process.exit(0);
                break;
            default:
                if (!parsedArgs.input) {
                    parsedArgs.input = arg;
                }
                break;
        }
    }

    if (!parsedArgs.input) {
        console.error('错误：请指定输入文件');
        printHelp();
        process.exit(1);
    }

    return parsedArgs;
}

/**
 * 打印帮助信息
 */
function printHelp(): void {
    console.log(`
LLVM IR 格式化工具

用法: ts-node llvm_formatter.ts <输入文件> [选项]

选项:
  -o, --output <文件>        输出文件路径（默认生成 .formatted.ll 文件）
  --indent <数字>            缩进空格数（默认4）
  --comment-style <语言>     注释语言：chinese 或 english（默认中文）
  --in-place                 原地修改文件
  -h, --help                 显示帮助信息

示例:
  ts-node llvm_formatter.ts input.ll
  ts-node llvm_formatter.ts input.ll -o output.ll
  ts-node llvm_formatter.ts input.ll --indent 2 --comment-style english
  ts-node llvm_formatter.ts input.ll --in-place
`);
}

/**
 * 主函数
 */
function main(): void {
    try {
        const args = parseArgs();

        // 检查输入文件
        const inputPath = path.resolve(args.input);
        if (!fs.existsSync(inputPath)) {
            console.error(`错误：文件 ${args.input} 不存在`);
            process.exit(1);
        }

        // 读取文件内容
        let content: string;
        try {
            content = fs.readFileSync(inputPath, 'utf-8');
        } catch (error) {
            console.error(`错误：无法读取文件 ${args.input}: ${error}`);
            process.exit(1);
        }

        // 创建格式化器
        const formatter = new LLVMIRFormatter({
            indentSize: args.indent || 4,
            commentStyle: args.commentStyle || 'chinese'
        });

        // 格式化代码
        let formattedContent: string;
        try {
            formattedContent = formatter.formatLLVMIR(content);
            formattedContent = formatter.addSectionComments(formattedContent);
        } catch (error) {
            console.error(`错误：格式化失败: ${error}`);
            process.exit(1);
        }

        // 确定输出文件
        let outputPath: string;
        if (args.output) {
            outputPath = path.resolve(args.output);
        } else if (args.inPlace) {
            outputPath = inputPath;
        } else {
            const ext = path.extname(inputPath);
            const base = path.basename(inputPath, ext);
            const dir = path.dirname(inputPath);
            outputPath = path.join(dir, `${base}.formatted${ext}`);
        }

        // 写入文件
        try {
            fs.writeFileSync(outputPath, formattedContent, 'utf-8');
            console.log(`格式化完成：${outputPath}`);
        } catch (error) {
            console.error(`错误：无法写入文件 ${outputPath}: ${error}`);
            process.exit(1);
        }

    } catch (error) {
        console.error(`错误：${error}`);
        process.exit(1);
    }
}

// 运行主函数
if (require.main === module) {
    main();
}

export { LLVMIRFormatter, FormatterOptions }; 