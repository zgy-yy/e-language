; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)

; 函数定义
define i32 @main() {
entry:
    %a_1 = alloca i32  ; 分配局部变量
    store i32 12, i32* %a_1  ; 存储值到变量
    %a_ptr_1 = alloca i32*  ; 分配局部变量
    store i32* %a_1, i32** %a_ptr_1  ; 存储值到变量
    store i32* %a_1, i32** %a_ptr_1  ; 存储值到变量
    %a_ptr_1_ptr_0 = load i32*, i32** %a_ptr_1  ; 加载变量值
    store i32 4, i32* %a_ptr_1_ptr_0  ; 存储值到变量
    %a_ptr_1_ptr_1 = load i32*, i32** %a_ptr_1  ; 加载变量值
    %a_ptr_1_reg_1 = load i32, i32* %a_ptr_1_ptr_1  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %a_ptr_1_reg_1)  ; 函数调用
    %a_1_reg_2 = load i32, i32* %a_1  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %a_1_reg_2)  ; 函数调用
    ret i32 0  ; 返回
    }
