; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)


; 函数定义
define i32 @main() {
entry:
    %main.arr = alloca [3 x [2 x i32]]  ; 分配局部变量
    %temp_arr1_0 = insertvalue [2 x i32] undef, i32 1, 0
    %temp_arr1_1 = insertvalue [2 x i32] %temp_arr1_0, i32 2, 1
    %temp_arr0_0 = insertvalue [3 x [2 x i32]] undef, [2 x i32] %temp_arr1_1, 0
    %temp_arr2_0 = insertvalue [2 x i32] undef, i32 4, 0
    %temp_arr2_1 = insertvalue [2 x i32] %temp_arr2_0, i32 5, 1
    %temp_arr0_1 = insertvalue [3 x [2 x i32]] %temp_arr0_0, [2 x i32] %temp_arr2_1, 1
    %temp_arr3_0 = insertvalue [2 x i32] undef, i32 3, 0
    %temp_arr3_1 = insertvalue [2 x i32] %temp_arr3_0, i32 6, 1
    %temp_arr0_2 = insertvalue [3 x [2 x i32]] %temp_arr0_1, [2 x i32] %temp_arr3_1, 2
    store [3 x [2 x i32]] %temp_arr0_2, [3 x [2 x i32]]* %main.arr  ; 存储值到变量
    %reg_index_ptr4 = getelementptr [3 x [2 x i32]], [3 x [2 x i32]]* %main.arr,i32 0, i32 0  ; 获取数组元素指针
    %temp_arr6_0 = insertvalue [2 x i32] undef, i32 23, 0
    %temp_arr6_1 = insertvalue [2 x i32] %temp_arr6_0, i32 9, 1
    store [2 x i32] %temp_arr6_1, [2 x i32]* %reg_index_ptr4  ; 存储值到变量
    %reg_index_ptr8 = getelementptr [3 x [2 x i32]], [3 x [2 x i32]]* %main.arr,i32 0, i32 0  ; 获取数组元素指针
    %reg_index_ptr7 = getelementptr [2 x i32], [2 x i32]* %reg_index_ptr8,i32 0, i32 1  ; 获取数组元素指针
    %reg_index7 = load i32, i32* %reg_index_ptr7  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_index7)  ; 函数调用
    ret i32 0  ; 返回
    }