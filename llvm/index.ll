; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)

; 函数定义
define void @bar_int_int_void_2(i32 %a_int_0, i32 %b_int_1) {
entry:
    %reg_bin_0 = icmp eq i32 %a_int_0, 9  ; 比较等于
    %reg_ifCond_0 = icmp ne i1 %reg_bin_0, 0  ; 比较不等于
    br i1 %reg_ifCond_0, label %if_then_0, label %if_end_0  ; 条件跳转

if_then_0:
    ret void  ; 返回
    br label %if_end_0  ; 跳转到标签

if_end_0:
    %reg_bin_2 = add i32 %a_int_0, %b_int_1
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_bin_2)  ; 函数调用
    %reg_bin_6 = add i32 %a_int_0, 1
    %reg_bar_int_int_void_2_9 = bitcast void (i32, i32)* @bar_int_int_void_2 to void (i32, i32)*
    call void %reg_bar_int_int_void_2_9(i32 %reg_bin_6, i32 %b_int_1)  ; 函数调用
    ret void  ; 返回
    }

; 函数定义
define i32* @call__int_int_void_3() {  ; 函数调用
entry:
    %a_bool_4 = alloca i1  ; 分配局部变量
    store i1 true, i1* %a_bool_4  ; 存储值到变量
    %b_bool_5 = alloca i1  ; 分配局部变量
    store i1 false, i1* %b_bool_5  ; 存储值到变量
    store i1 false, i1* %a_bool_4  ; 存储值到变量
    %reg_bar_int_int_void_2_0 = bitcast void (i32, i32)* @bar_int_int_void_2 to void (i32, i32)*
    ret i32* %reg_bar_int_int_void_2_0  ; 返回
    }

; 函数定义
define void @main() {
entry:
    %foo_int_int_void_7 = alloca i32*  ; 分配局部变量
    %reg_call__int_int_void_3_1 = bitcast i32* ()* @call__int_int_void_3 to i32* ()*  ; 函数调用
    %reg_call_0 = call i32* %reg_call__int_int_void_3_1()  ; 函数调用
    store i32* %reg_call_0, i32** %foo_int_int_void_7  ; 存储值到变量
    %reg_foo_int_int_void_7_3 = load i32*, i32** %foo_int_int_void_7  ; 加载变量值
    call void %reg_foo_int_int_void_7_3(i32 1, i32 1)  ; 函数调用
    ret void  ; 返回
    }
