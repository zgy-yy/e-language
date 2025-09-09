; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)


; 函数定义
define i32 @main() {
entry:
    %main.a = alloca i32  ; 分配局部变量
    %reg_function1 = bitcast i32* ()* @foo to i32* ()*
    %reg_call0 = call i32 %reg_function1()  ; 函数调用
    store i32 %reg_call0, i32* %main.a  ; 存储值到变量
    ret i32 2  ; 返回
    }

; 函数定义
define i32 @foo() {
entry:
    ret i32 23  ; 返回
    }
