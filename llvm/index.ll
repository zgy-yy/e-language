; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)

; 函数定义
define void @bar__void_0() {
entry:
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 1)  ; 函数调用
    ret void  ; 返回
    }

; 函数定义
define i32* @foo_int_int__void_3(i32 %a_int_1, i32 %b_int_2) {
entry:
    %reg_bar__void_0_0 = bitcast void ()* @bar__void_0 to void ()*
    ret i32* %reg_bar__void_0_0  ; 返回
    }

; 函数定义
define void @main() {
entry:
    %func__void_4 = alloca i32*  ; 分配局部变量
    %reg_bar__void_0_0 = bitcast void ()* @bar__void_0 to void ()*
    store i32* %reg_bar__void_0_0, i32** %func__void_4  ; 存储值到变量
    %reg_func__void_4_2 = bitcast void ()* @func__void_4 to void ()*
    call void %reg_func__void_4_2()  ; 函数调用
    ret void  ; 返回
    }
