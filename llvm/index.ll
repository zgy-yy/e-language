; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)

    %A = type { i32, i32, i1 }

; 函数定义
define i32 @main() {
entry:
    %arr_arr_int_1 = alloca [5 x i32]  ; 分配局部变量
    %temp_0_0 = insertvalue [5 x i32] undef, i32 1, 0
    %temp_1_0 = insertvalue [5 x i32] %temp_0_0, i32 2, 1
    %temp_2_0 = insertvalue [5 x i32] %temp_1_0, i32 3, 2
    %temp_3_0 = insertvalue [5 x i32] %temp_2_0, i32 4, 3
    %temp_4_0 = insertvalue [5 x i32] %temp_3_0, i32 5, 4
    store [5 x i32] %temp_4_0, [5 x i32]* %arr_arr_int_1  ; 存储值到变量
    %reg_arr_arr_int_1_1 = load i32, i32* %arr_arr_int_1  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_arr_arr_int_1_1)  ; 函数调用
    ret i32 0  ; 返回
    }
