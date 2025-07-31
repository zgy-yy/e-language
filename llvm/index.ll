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
    %sh_struct_A_1 = alloca %A  ; 分配局部变量
    %temp_0_a = insertvalue %A undef, i32 12, 0
    %temp_0_b = insertvalue %A %temp_0_a, i32 4, 1
    %temp_0_c = insertvalue %A %temp_0_b, i1 false, 2
    store %A %temp_0_c, %A* %sh_struct_A_1  ; 存储值到变量
    %bb_struct_B_2 = alloca %B  ; 分配局部变量
    %temp_1_i = insertvalue %B undef, i32 1, 0
    %reg_sh_struct_A_1_2 = load %A, %A* %sh_struct_A_1  ; 加载变量值
    %temp_1_a = insertvalue %B %temp_1_i, %A %reg_sh_struct_A_1_2, 1
    store %B %temp_1_a, %B* %bb_struct_B_2  ; 存储值到变量
    %reg_bb_struct_B_2_5 = load %B, %B* %bb_struct_B_2  ; 加载变量值
    %regfield_a_4 = extractvalue %B %reg_bb_struct_B_2_5, 1
    %regfield_b_3 = insertvalue %A %regfield_a_4, i32 312, 1
    %reg_bb_struct_B_2_6 = load %B, %B* %bb_struct_B_2  ; 加载变量值
    %regfield_a_3 = insertvalue %B %reg_bb_struct_B_2_6, %A %regfield_b_3, 1
    store %B %regfield_a_3, %B* %bb_struct_B_2  ; 存储值到变量
    %reg_bb_struct_B_2_9 = load %B, %B* %bb_struct_B_2  ; 加载变量值
    %regfield_a_8 = extractvalue %B %reg_bb_struct_B_2_9, 1
    %regfield_b_7 = extractvalue %A %regfield_a_8, 1
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %regfield_b_7)  ; 函数调用
    ret i32 0  ; 返回
    }
