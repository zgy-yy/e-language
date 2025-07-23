; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)

    %A = type { i32, i32, i1 }

; 函数定义
define i32 @main() {
entry:
    %st_struct_A_1 = alloca %A  ; 分配局部变量
    %reg_struct_0 = alloca %A  ; 分配局部变量
    %regptr_a_0 = getelementptr inbounds %A, %A* %reg_struct_0, i32 0, i32 0  ; 获取数组元素指针
    store i32 1, i32* %regptr_a_0  ; 存储值到变量
    %regptr_b_0 = getelementptr inbounds %A, %A* %reg_struct_0, i32 0, i32 1  ; 获取数组元素指针
    store i32 2, i32* %regptr_b_0  ; 存储值到变量
    %regptr_c_0 = getelementptr inbounds %A, %A* %reg_struct_0, i32 0, i32 2  ; 获取数组元素指针
    store i1 true, i1* %regptr_c_0  ; 存储值到变量
    %reg_struct_0_load = load %A, %A* %reg_struct_0  ; 加载变量值
    store %A %reg_struct_0_load, %A* %st_struct_A_1  ; 存储值到变量
    %regptr_a_1 = getelementptr inbounds %A, %A* %st_struct_A_1, i32 0, i32 0  ; 获取数组元素指针
    %regptr_a_1_load = load i32, i32* %regptr_a_1  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %regptr_a_1_load)  ; 加载变量值
    ret i32 0  ; 返回
    }
