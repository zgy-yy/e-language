; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)

; 函数定义
define void @bar_int_void_1(i32 %a_int_0) {
entry:
    %reg_bin_0 = icmp eq i32 %a_int_0, 9  ; 比较等于
    %reg_ifCond_0 = icmp ne i1 %reg_bin_0, 0  ; 比较不等于
    br i1 %reg_ifCond_0, label %if_then_0, label %if_end_0  ; 条件跳转

if_then_0:
    ret void  ; 返回
    br label %if_end_0  ; 跳转到标签

if_end_0:
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %a_int_0)  ; 函数调用
    %reg_bin_4 = add i32 %a_int_0, 1
    %reg_bar_int_void_1_6 = bitcast void (i32)* @bar_int_void_1 to void (i32)*
    call void %reg_bar_int_void_1_6(i32 %reg_bin_4)  ; 函数调用
    ret void  ; 返回
    }

; 函数定义
define void @main() {
entry:
    %reg_bar_int_void_1_1 = bitcast void (i32)* @bar_int_void_1 to void (i32)*
    call void %reg_bar_int_void_1_1(i32 1)  ; 函数调用
    ret void  ; 返回
    }
