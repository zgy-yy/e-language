; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)

; 函数定义
define i32 @main() {
entry:
    %f = alloca i32  ; 分配局部变量
    store i32 1, i32* %f  ; 存储值到变量
    %g = alloca i32  ; 分配局部变量
    %local_f_1 = load i32, i32* %f  ; 加载变量值
    %new0 = add i32 %local_f_1, 1
    store i32 %new0, i32* %f  ; 存储值到变量
    store i32 %local_f_1, i32* %g  ; 存储值到变量
    %local_g_2 = load i32, i32* %g  ; 加载变量值
    %print3 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %local_g_2)  ; 函数调用
    ret i32 0  ; 返回
    }
