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
    %sh_1 = alloca %A  ; 分配局部变量
    %temp_0_a = insertvalue %A undef, i32 12, 0
    %temp_0_b = insertvalue %A %temp_0_a, i32 4, 1
    %temp_0_c = insertvalue %A %temp_0_b, i1 false, 2
    store %A %temp_0_c, %A* %sh_1  ; 存储值到变量
    %bb_1 = alloca %B  ; 分配局部变量
    %temp_1_i = insertvalue %B undef, i32 1, 0
    %sh_1_reg_2 = load %A, %A* %sh_1  ; 加载变量值
    %temp_1_a = insertvalue %B %temp_1_i, %A %sh_1_reg_2, 1
    store %B %temp_1_a, %B* %bb_1  ; 存储值到变量
    %reg_field_ptr_a_6 = getelementptr %B, %B* %bb_1, i32 0, i32 1  ; 获取数组元素指针
    %reg_field_ptr_b_5 = getelementptr %A, %A* %reg_field_ptr_a_6, i32 0, i32 1  ; 获取数组元素指针
    %regfield_b_4 = load i32, i32* %reg_field_ptr_b_5  ; 加载变量值
    %reg_field_ptr_a_8 = getelementptr %B, %B* %bb_1, i32 0, i32 1  ; 获取数组元素指针
    %reg_field_ptr_b_7 = getelementptr %A, %A* %reg_field_ptr_a_8, i32 0, i32 1  ; 获取数组元素指针
    %reg_suffix_3 = add i32 %regfield_b_4, 1
    store i32 %reg_suffix_3, i32* %reg_field_ptr_b_7  ; 存储值到变量
    %reg_field_ptr_a_11 = getelementptr %B, %B* %bb_1, i32 0, i32 1  ; 获取数组元素指针
    %reg_field_ptr_b_10 = getelementptr %A, %A* %reg_field_ptr_a_11, i32 0, i32 1  ; 获取数组元素指针
    %regfield_b_9 = load i32, i32* %reg_field_ptr_b_10  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %regfield_b_9)  ; 函数调用
    %reg_field_ptr_b_13 = getelementptr %A, %A* %sh_1, i32 0, i32 1  ; 获取数组元素指针
    %regfield_b_12 = load i32, i32* %reg_field_ptr_b_13  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %regfield_b_12)  ; 函数调用
    ret i32 0  ; 返回
    }
