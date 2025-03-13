#!/bin/bash

# 检查是否提供了文件名参数
if [ -z "$1" ]; then
    echo "Usage: $0 <filename.asm>"
    exit 1
fi

# 获取文件名、基名和父级目录
FILENAME="$1"
BASENAME=$(basename "$FILENAME" .asm)
PARENT_DIR=$(dirname "$FILENAME")

# 检查文件是否以 .asm 结尾
if [[ "$FILENAME" != *.asm ]]; then
    echo "Error: The file must have a .asm extension"
    exit 1
fi

# 创建输出目录
OBJ_DIR="$PARENT_DIR/obj"
BIN_DIR="$PARENT_DIR/bin"
mkdir -p "$OBJ_DIR"
mkdir -p "$BIN_DIR"

# 编译汇编文件
nasm -f elf64 "$FILENAME" -o "$OBJ_DIR/$BASENAME.o"
if [ $? -ne 0 ]; then
    echo "Error: Compilation failed"
    exit 1
fi

# 链接目标文件
gcc -no-pie "$OBJ_DIR/$BASENAME.o" -o "$BIN_DIR/$BASENAME"
if [ $? -ne 0 ]; then
    echo "Error: Linking failed"
    exit 1
fi

# 运行生成的可执行文件
"$BIN_DIR/$BASENAME"
if [ $? -ne 0 ]; then
    echo "Error: Execution failed"
    exit 1
fi
