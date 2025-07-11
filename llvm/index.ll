; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)

; 函数定义
define i32 @foo_fun_2(i32 %a_int_0, i32 %b_int_1) {
entry:
    %reg_bin_0 = add i32 %a_int_0, %b_int_1
    ret i32 %reg_bin_0  ; 返回
    }

; 函数定义
define void @main() {
entry:
    %b_int_3 = alloca i32  ; 分配局部变量
    %reg_call_3 = call i32 @foo_fun_2(i32 1, i32 3)  ; 函数调用
    store i32 %reg_call_3, i32* %b_int_3  ; 存储值到变量
    %local_reg_b_int_3_5 = load i32, i32* %b_int_3  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %local_reg_b_int_3_5)  ; 函数调用
    ret void  ; 返回
    }
