; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)

    %A = type { i32, i32, i1 }

; 函数定义
define [2 x i32] @foo__arr_int_0() {
entry:
    %arr_arr_int_1 = alloca [2 x i32]  ; 分配局部变量
    %temp_0_0 = insertvalue [2 x i32] undef, i32 1, 0
    %temp_1_0 = insertvalue [2 x i32] %temp_0_0, i32 2, 1
    store [2 x i32] %temp_1_0, [2 x i32]* %arr_arr_int_1  ; 存储值到变量
    %reg_arr_arr_int_1_1 = load [2 x i32], [2 x i32]* %arr_arr_int_1  ; 加载变量值
    ret [2 x i32] %reg_arr_arr_int_1_1  ; 返回
    }

; 函数定义
define i32 @main() {
entry:
    %c_arr_int_3 = alloca [2 x i32]  ; 分配局部变量
    %reg_foo__arr_int_0_1 = bitcast [2 x i32] ()* @foo__arr_int_0 to [2 x i32] ()*
    %reg_call_0 = call [2 x i32] %reg_foo__arr_int_0_1()  ; 函数调用
    store [2 x i32] %reg_call_0, [2 x i32]* %c_arr_int_3  ; 存储值到变量
    %reg_c_arr_int_3_3 = load [2 x i32], [2 x i32]* %c_arr_int_3  ; 加载变量值
    %temp_arr_alloca2 = alloca [2 x i32]  ; 分配局部变量
    store [2 x i32] %reg_c_arr_int_3_3, [2 x i32]* %temp_arr_alloca2  ; 分配局部变量
    %reg_index_2_1 = getelementptr [2 x i32], [2 x i32]* %temp_arr_alloca2,i32 0, i32 1  ; 分配局部变量
    %reg_index_2 = load i32, i32* %reg_index_2_1  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_index_2)  ; 函数调用
    ret i32 0  ; 返回
    }
