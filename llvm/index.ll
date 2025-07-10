; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)

; 函数定义
define void @foo_fun_1() {
entry:
    %a_int_0 = alloca i32  ; 分配局部变量
    store i32 2, i32* %a_int_0  ; 存储值到变量
    %local_a_int_0_0 = load i32, i32* %a_int_0  ; 加载变量值
    %print1 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %local_a_int_0_0)  ; 函数调用
    ret void  ; 返回
    }

; 函数定义
define i32 @main() {
entry:
    %a_int_2 = alloca i32  ; 分配局部变量
    store i32 1, i32* %a_int_2  ; 存储值到变量
    %local_a_int_2_2 = load i32, i32* %a_int_2  ; 加载变量值
    %print3 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %local_a_int_2_2)  ; 函数调用
    %call4 = call i32 @foo_fun_1()  ; 函数调用
    %local_a_int_2_5 = load i32, i32* %a_int_2  ; 加载变量值
    ret i32 %local_a_int_2_5  ; 返回
    }
