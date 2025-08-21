; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)


    %struct.global.St = type { [2 x i32], i1 }

; 函数定义
define i32 @main() {
entry:
    %main.a = alloca [2 x %struct.global.St]  ; 分配局部变量
    %temp_arr2_0 = insertvalue [2 x i32] undef, i32 23, 0
    %temp_arr2_1 = insertvalue [2 x i32] %temp_arr2_0, i32 56, 1
    %temp_struct1_age = insertvalue %struct.global.St undef, [2 x i32] %temp_arr2_1, 0
    %temp_struct1_is = insertvalue %struct.global.St %temp_struct1_age, i1 false, 1
    %temp_arr0_0 = insertvalue [2 x %struct.global.St] undef, %struct.global.St %temp_struct1_is, 0
    %temp_arr4_0 = insertvalue [2 x i32] undef, i32 21, 0
    %temp_arr4_1 = insertvalue [2 x i32] %temp_arr4_0, i32 45, 1
    %temp_struct3_age = insertvalue %struct.global.St undef, [2 x i32] %temp_arr4_1, 0
    %temp_struct3_is = insertvalue %struct.global.St %temp_struct3_age, i1 true, 1
    %temp_arr0_1 = insertvalue [2 x %struct.global.St] %temp_arr0_0, %struct.global.St %temp_struct3_is, 1
    store [2 x %struct.global.St] %temp_arr0_1, [2 x %struct.global.St]* %main.a  ; 存储值到变量
    %reg_a8 = load [2 x %struct.global.St], [2 x %struct.global.St]* %main.a  ; 加载变量值
    %temp_arr7 = alloca [2 x %struct.global.St]  ; 分配局部变量
    store [2 x %struct.global.St] %reg_a8, [2 x %struct.global.St]* %temp_arr7  ; 存储值到变量
    %reg_index_ptr7 = getelementptr [2 x %struct.global.St], [2 x %struct.global.St]* %temp_arr7,i32 0, i32 0  ; 获取数组元素指针
    %reg_index7 = load %struct.global.St, %struct.global.St* %reg_index_ptr7  ; 加载变量值
    %reg_fieldage_6 = extractvalue %struct.global.St %reg_index7, 0
    %temp_arr5 = alloca [2 x i32]  ; 分配局部变量
    store [2 x i32] %reg_fieldage_6, [2 x i32]* %temp_arr5  ; 存储值到变量
    %reg_index_ptr5 = getelementptr [2 x i32], [2 x i32]* %temp_arr5,i32 0, i32 1  ; 获取数组元素指针
    %reg_index5 = load i32, i32* %reg_index_ptr5  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_index5)  ; 函数调用
    ret i32 0  ; 返回
    }