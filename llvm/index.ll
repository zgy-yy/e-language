; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)

    %A = type { i32, i32, i1 }
    %B = type { i32, %A }

; 函数定义
define i32 @main() {
entry:
    %arr_1 = alloca [3 x i32]  ; 分配局部变量
    %temp_0_0 = insertvalue [3 x i32] undef, i32 1, 0
    %temp_0_1 = insertvalue [3 x i32] %temp_0_0, i32 2, 1
    %temp_0_2 = insertvalue [3 x i32] %temp_0_1, i32 3, 2
    store [3 x i32] %temp_0_2, [3 x i32]* %arr_1  ; 存储值到变量
    %a_1 = alloca i32  ; 分配局部变量
    %reg_index_ptr_3 = getelementptr [3 x i32], [3 x i32]* %arr_1,i32 0, i32 0  ; 获取数组元素指针
    %reg_index_2 = load i32, i32* %reg_index_ptr_3  ; 加载变量值
    %reg_index_ptr_4 = getelementptr [3 x i32], [3 x i32]* %arr_1,i32 0, i32 0  ; 获取数组元素指针
    %reg_suffix_1 = add i32 %reg_index_2, 1
    store i32 %reg_suffix_1, i32* %reg_index_ptr_4  ; 存储值到变量
    store i32 %reg_index_2, i32* %a_1  ; 存储值到变量
    %a_1_reg_5 = load i32, i32* %a_1  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %a_1_reg_5)  ; 函数调用
    %reg_index_ptr_7 = getelementptr [3 x i32], [3 x i32]* %arr_1,i32 0, i32 0  ; 获取数组元素指针
    %reg_index_6 = load i32, i32* %reg_index_ptr_7  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_index_6)  ; 函数调用
    ret i32 0  ; 返回
    }
