; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)


    @main.fn = global i32* zeroinitializer

; 函数定义
define i32 @main() {
entry:
    %reg_function0 = bitcast i32 (i32)* @anonymous.8828 to i32 (i32)*
    store i32* @anonymous.8828, i32** @main.fn  ; 存储值到变量
    %main.n = alloca i32  ; 分配局部变量
    %reg_fn10 = load i32*, i32** @main.fn  ; 加载变量值
    %reg_call9 = call i32 %reg_fn10(i32 3)  ; 函数调用
    store i32 %reg_call9, i32* %main.n  ; 存储值到变量
    %reg_n11 = load i32, i32* %main.n  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_n11)  ; 函数调用
    ret i32 0  ; 返回
    }

; 函数定义
define i32 @anonymous.8828 (i32 %i) {
entry:
    %anonymous.8828.i = alloca i32  ; 分配局部变量
    store i32 %i, i32* %anonymous.8828.i  ; 存储值到变量
    %reg_i2 = load i32, i32* %anonymous.8828.i  ; 加载变量值
    %reg_bin1 = icmp sle i32 %reg_i2, 0  ; 比较小于等于
    %reg_ifCond0 = icmp ne i1 %reg_bin1, 0  ; 比较不等于
    br i1 %reg_ifCond0, label %if_then0, label %if_end0  ; 条件跳转

if_then0:
    ret i32 0  ; 返回
    br label %if_end0  ; 跳转到标签

if_end0:
    %reg_i4 = load i32, i32* %anonymous.8828.i  ; 加载变量值
    %reg_i7 = load i32, i32* %anonymous.8828.i  ; 加载变量值
    %reg_bin6 = sub i32 %reg_i7, 1
    %reg_fn8 = load i32*, i32** @main.fn  ; 加载变量值
    %reg_call5 = call i32 %reg_fn8(i32 %reg_bin6)  ; 函数调用
    %reg_bin3 = add i32 %reg_i4, %reg_call5  ; 函数调用
    ret i32 %reg_bin3  ; 返回
    }