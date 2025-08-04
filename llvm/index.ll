; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)

    %A = type { i32, i32, i1 }

; 函数定义
define i32 @main() {
entry:
    %a_int_1 = alloca i32  ; 分配局部变量
    store i32 5, i32* %a_int_1  ; 存储值到变量
    %reg_a_int_1_0 = load i32, i32* %a_int_1  ; 加载变量值
    %arr_arr_int_2 = alloca i32*,i32 %reg_a_int_1_0  ; 分配局部变量
    %temp_0_1 = insertvalue [5 x i32] undef, i32 1, 0
    %temp_1_1 = insertvalue [5 x i32] %temp_0_1, i32 2, 1
    %temp_2_1 = insertvalue [5 x i32] %temp_1_1, i32 3, 2
    %temp_3_1 = insertvalue [5 x i32] %temp_2_1, i32 4, 3
    %temp_4_1 = insertvalue [5 x i32] %temp_3_1, i32 5, 4
    store [5 x i32] %temp_4_1, i32* %arr_arr_int_2  ; 存储值到变量
    %temp_0_2 = insertvalue [5 x i32] undef, i32 2, 0
    %temp_1_2 = insertvalue [5 x i32] %temp_0_2, i32 3, 1
    %temp_2_2 = insertvalue [5 x i32] %temp_1_2, i32 4, 2
    %temp_3_2 = insertvalue [5 x i32] %temp_2_2, i32 5, 3
    %temp_4_2 = insertvalue [5 x i32] %temp_3_2, i32 6, 4
    store [5 x i32] %temp_4_2, i32** %arr_arr_int_2  ; 存储值到变量
    %reg_arr_arr_int_2_3 = load i32*, i32** %arr_arr_int_2  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32* %reg_arr_arr_int_2_3)  ; 函数调用
    ret i32 0  ; 返回
    }
