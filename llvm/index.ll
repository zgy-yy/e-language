; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)


    %struct.global.A = type { i32, i1 }
    %struct.global.B = type { %struct.global.A, i1 }
    @global.a = global %struct.global.A { i32 12, i1 true }
    @global.b = global %struct.global.B { %struct.global.A { i32 12, i1 true }, i1 false }
    @global.m = global i32 98
    @global.n = global i32 98
    @global.bp = global %struct.global.B* @global.b
    @global.arr = global [3 x i32] [i32 1, i32 2, i32 3 ]
    @global.pa = global [3 x i32]* @global.arr

; 函数定义
define i32 @main() {
entry:
    %reg_bp6_ptr6 = load %struct.global.B*, %struct.global.B** @global.bp  ; 加载变量值
    %reg_fielda_5 = getelementptr %struct.global.B, %struct.global.B* %reg_bp6_ptr6, i32 0, i32 0  ; 获取数组元素指针
    %reg_fieldage_4 = getelementptr %struct.global.A, %struct.global.A* %reg_fielda_5, i32 0, i32 0  ; 获取数组元素指针
    store i32 5, i32* %reg_fieldage_4  ; 存储值到变量
    %reg_pa8_ptr8 = load [3 x i32]*, [3 x i32]** @global.pa  ; 加载变量值
    %reg_pa8 = load [3 x i32], [3 x i32]* %reg_pa8_ptr8  ; 加载变量值
    %temp_arr7 = alloca [3 x i32]  ; 分配局部变量
    store [3 x i32] %reg_pa8, [3 x i32]* %temp_arr7  ; 存储值到变量
    %reg_index_ptr7 = getelementptr [3 x i32], [3 x i32]* %temp_arr7,i32 0, i32 0  ; 获取数组元素指针
    %reg_index7 = load i32, i32* %reg_index_ptr7  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_index7)  ; 函数调用
    %reg_pa10_ptr10 = load [3 x i32]*, [3 x i32]** @global.pa  ; 加载变量值
    %reg_index_ptr9 = getelementptr [3 x i32], [3 x i32]* %reg_pa10_ptr10,i32 0, i32 0  ; 获取数组元素指针
    store i32 88, i32* %reg_index_ptr9  ; 存储值到变量
    %reg_pa12_ptr12 = load [3 x i32]*, [3 x i32]** @global.pa  ; 加载变量值
    %reg_pa12 = load [3 x i32], [3 x i32]* %reg_pa12_ptr12  ; 加载变量值
    %temp_arr11 = alloca [3 x i32]  ; 分配局部变量
    store [3 x i32] %reg_pa12, [3 x i32]* %temp_arr11  ; 存储值到变量
    %reg_index_ptr11 = getelementptr [3 x i32], [3 x i32]* %temp_arr11,i32 0, i32 0  ; 获取数组元素指针
    %reg_index11 = load i32, i32* %reg_index_ptr11  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_index11)  ; 函数调用
    ret i32 0  ; 返回
    }