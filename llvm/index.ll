; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)

    %A = type { [2 x i32], i32 }

; 函数定义
define i32 @main() {
entry:
    %cc_1 = alloca [2 x %A]  ; 分配局部变量
    %temp_2_0 = insertvalue [2 x i32] undef, i32 1, 0
    %temp_2_1 = insertvalue [2 x i32] %temp_2_0, i32 9, 1
    %temp_1_a = insertvalue %A undef, [2 x i32] %temp_2_1, 0
    %temp_1_b = insertvalue %A %temp_1_a, i32 3, 1
    %temp_0_0 = insertvalue [2 x %A] undef, %A %temp_1_b, 0
    %temp_4_0 = insertvalue [2 x i32] undef, i32 1, 0
    %temp_4_1 = insertvalue [2 x i32] %temp_4_0, i32 3, 1
    %temp_3_a = insertvalue %A undef, [2 x i32] %temp_4_1, 0
    %temp_3_b = insertvalue %A %temp_3_a, i32 3, 1
    %temp_0_1 = insertvalue [2 x %A] %temp_0_0, %A %temp_3_b, 1
    store [2 x %A] %temp_0_1, [2 x %A]* %cc_1  ; 存储值到变量
    %reg_index_ptr_7 = getelementptr [2 x %A], [2 x %A]* %cc_1,i32 0, i32 0  ; 获取数组元素指针
    %reg_field_ptr_a_6 = getelementptr %A, %A* %reg_index_ptr_7, i32 0, i32 0  ; 获取数组元素指针
    %reg_index_ptr_5 = getelementptr [2 x i32], [2 x i32]* %reg_field_ptr_a_6,i32 0, i32 1  ; 获取数组元素指针
    store i32 99, i32* %reg_index_ptr_5  ; 存储值到变量
    %reg_index_ptr_11 = getelementptr [2 x %A], [2 x %A]* %cc_1,i32 0, i32 0  ; 获取数组元素指针
    %reg_field_ptr_a_10 = getelementptr %A, %A* %reg_index_ptr_11, i32 0, i32 0  ; 获取数组元素指针
    %reg_index_ptr_9 = getelementptr [2 x i32], [2 x i32]* %reg_field_ptr_a_10,i32 0, i32 1  ; 获取数组元素指针
    %reg_index_8 = load i32, i32* %reg_index_ptr_9  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_index_8)  ; 函数调用
    ret i32 0  ; 返回
    }
