; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)

    %A = type { i32, i1 }
    %B = type { %A, i32 }

; 函数定义
define i32 @main() {
entry:
    %ar_1 = alloca [3 x i32]  ; 分配局部变量
    %temp_0_0 = insertvalue [3 x i32] undef, i32 9, 0
    %temp_0_1 = insertvalue [3 x i32] %temp_0_0, i32 7, 1
    %temp_0_2 = insertvalue [3 x i32] %temp_0_1, i32 8, 2
    store [3 x i32] %temp_0_2, [3 x i32]* %ar_1  ; 存储值到变量
    %arr_1 = alloca [2 x [3 x i32]]  ; 分配局部变量
    %temp_2_0 = insertvalue [3 x i32] undef, i32 1, 0
    %temp_2_1 = insertvalue [3 x i32] %temp_2_0, i32 2, 1
    %temp_2_2 = insertvalue [3 x i32] %temp_2_1, i32 3, 2
    %temp_1_0 = insertvalue [1 x [3 x i32]] undef, [3 x i32] %temp_2_2, 0
    store [1 x [3 x i32]] %temp_1_0, [2 x [3 x i32]]* %arr_1  ; 存储值到变量
    %reg_index_ptr_3 = getelementptr [2 x [3 x i32]], [2 x [3 x i32]]* %arr_1,i32 0, i32 1  ; 获取数组元素指针
    %ar_1_reg_4 = load [3 x i32], [3 x i32]* %ar_1  ; 加载变量值
    store [3 x i32] %ar_1_reg_4, [3 x i32]* %reg_index_ptr_3  ; 存储值到变量
    %reg_index_ptr_6 = getelementptr [2 x [3 x i32]], [2 x [3 x i32]]* %arr_1,i32 0, i32 1  ; 获取数组元素指针
    %reg_index_ptr_5 = getelementptr [3 x i32], [3 x i32]* %reg_index_ptr_6,i32 0, i32 2  ; 获取数组元素指针
    store i32 9, i32* %reg_index_ptr_5  ; 存储值到变量
    %arr_1_reg_9 = load [2 x [3 x i32]], [2 x [3 x i32]]* %arr_1  ; 加载变量值
    %temp_arr_8 = alloca [2 x [3 x i32]]  ; 分配局部变量
    store [2 x [3 x i32]] %arr_1_reg_9, [2 x [3 x i32]]* %temp_arr_8  ; 存储值到变量
    %reg_index_ptr_8 = getelementptr [2 x [3 x i32]], [2 x [3 x i32]]* %temp_arr_8,i32 0, i32 1  ; 获取数组元素指针
    %reg_index_8 = load [3 x i32], [3 x i32]* %reg_index_ptr_8  ; 加载变量值
    %temp_arr_7 = alloca [3 x i32]  ; 分配局部变量
    store [3 x i32] %reg_index_8, [3 x i32]* %temp_arr_7  ; 存储值到变量
    %reg_index_ptr_7 = getelementptr [3 x i32], [3 x i32]* %temp_arr_7,i32 0, i32 2  ; 获取数组元素指针
    %reg_index_7 = load i32, i32* %reg_index_ptr_7  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_index_7)  ; 函数调用
    %ar_1_reg_11 = load [3 x i32], [3 x i32]* %ar_1  ; 加载变量值
    %temp_arr_10 = alloca [3 x i32]  ; 分配局部变量
    store [3 x i32] %ar_1_reg_11, [3 x i32]* %temp_arr_10  ; 存储值到变量
    %reg_index_ptr_10 = getelementptr [3 x i32], [3 x i32]* %temp_arr_10,i32 0, i32 2  ; 获取数组元素指针
    %reg_index_10 = load i32, i32* %reg_index_ptr_10  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_index_10)  ; 函数调用
    ret i32 0  ; 返回
    }
