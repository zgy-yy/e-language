#!/bin/bash

# 检查 LLVM 工具链是否安装
if ! command -v llc &> /dev/null; then
    echo "错误: 未找到 LLVM 工具链，请先安装 LLVM"
    echo "可以使用以下命令安装: brew install llvm"
    exit 1
fi

# 设置 LLVM IR 文件路径
LL_FILE="llvm/index.ll"
OUTPUT_DIR="llvm"

# 清理上一次生成的文件
echo "清理上一次生成的文件..."
rm -f "$OUTPUT_DIR/index.s"
rm -f "$OUTPUT_DIR/index.o"
rm -f "$OUTPUT_DIR/index"

# 创建输出目录
mkdir -p "$OUTPUT_DIR"

# 检查 LLVM IR 文件是否存在
if [ ! -f "$LL_FILE" ]; then
    echo "错误: LLVM IR 文件 $LL_FILE 不存在"
    exit 1
fi

echo "开始格式化 LLVM IR 文件..."

# 格式化 LLVM IR 文件
echo "1. 使用 npm run format 格式化 LLVM IR 文件..."
if npm run format; then
    echo "格式化完成！"
else
    echo "格式化失败！"
    exit 1
fi

echo "开始编译 LLVM IR 文件..."

# 编译步骤
echo "2. 将 LLVM IR 编译为汇编代码..."
llc "$LL_FILE" -o "$OUTPUT_DIR/index.s"

echo "3. 将汇编代码编译为目标文件..."
as "$OUTPUT_DIR/index.s" -o "$OUTPUT_DIR/index.o"

echo "4. 链接目标文件..."
ld "$OUTPUT_DIR/index.o" -o "$OUTPUT_DIR/index" \
    -lSystem \
    -syslibroot `xcrun -sdk macosx --show-sdk-path` \
    -e _main \
    -arch arm64

# 检查编译是否成功
if [ $? -eq 0 ]; then
    echo "编译成功！"
    echo "运行程序..."
    "$OUTPUT_DIR/index"
    
    # 运行完成后清理所有生成的文件
    echo "执行完毕"
else
    echo "编译失败！"
    exit 1
fi
