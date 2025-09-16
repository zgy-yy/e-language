; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)


    %struct.global.Iner = type { i32 }
    %struct.global.St = type { i32, i1, %struct.global.Iner }

; 函数定义
define i32 @main() {
entry:
    %main.t = alloca %struct.global.St  ; 分配局部变量
    %temp_struct0_a = insertvalue %struct.global.St undef, i32 23, 0
    %temp_struct0_b = insertvalue %struct.global.St %temp_struct0_a, i1 false, 1
    %temp_struct1_c = insertvalue %struct.global.Iner undef, i32 12, 0
    %temp_struct0_in = insertvalue %struct.global.St %temp_struct0_b, %struct.global.Iner %temp_struct1_c, 2
    store %struct.global.St %temp_struct0_in, %struct.global.St* %main.t  ; 存储值到变量
    %reg_fieldin_3 = getelementptr %struct.global.St, %struct.global.St* %main.t, i32 0, i32 2  ; 获取数组元素指针
    %reg_fieldc_2 = getelementptr %struct.global.Iner, %struct.global.Iner* %reg_fieldin_3, i32 0, i32 0  ; 获取数组元素指针
    store i32 78, i32* %reg_fieldc_2  ; 存储值到变量
    %reg_field_ptrin_6 = getelementptr %struct.global.St, %struct.global.St* %main.t, i32 0, i32 2  ; 获取数组元素指针
    %reg_field_ptrc_5 = getelementptr %struct.global.Iner, %struct.global.Iner* %reg_field_ptrin_6, i32 0, i32 0  ; 获取数组元素指针
    %reg_fieldc_5 = load i32, i32* %reg_field_ptrc_5  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_fieldc_5)  ; 函数调用
    %main.tup = alloca {i32,i32}  ; 分配局部变量
    %temp_tuple8_0 = insertvalue {i32,i32} undef, i32 90, 0
    %temp_tuple8_1 = insertvalue {i32,i32} %temp_tuple8_0, i32 23, 1
    store {i32,i32} %temp_tuple8_1, {i32,i32}* %main.tup  ; 存储值到变量
    %reg_index_ptr9 = getelementptr {i32,i32}, {i32,i32}* %main.tup,i32 0,i32 1  ; 获取数组元素指针
    %reg_index9 = load i32, i32* %reg_index_ptr9  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_index9)  ; 函数调用
    ret i32 0  ; 返回
    }