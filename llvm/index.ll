; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"

; 声明 printf 函数
declare i32 @printf(i8*, ...)

; 定义全局字符串常量
@.str = private unnamed_addr constant [11 x i8] c"Hello: %d\0A\00", align 1

; 定义主函数
define i32 @main() {
    ; 调用 printf 函数打印数字 42
    %1 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @.str, i32 0, i32 0), i32 42)
    
    ; 返回 0 表示程序成功执行
    ret i32 0
}
