; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)


    @global.a = global i32 12
    @foo.fn = global i32* zeroinitializer
    @for0.c = global i32 zeroinitializer

; 函数定义
define i32* @foo() {
entry:
    br label %for_init0  ; 跳转到标签

for_init0:
    store i32 0, i32* @for0.c  ; 存储值到变量
    br label %for_cond0  ; 跳转到标签

for_cond0:
    %reg_c1 = load i32, i32* @for0.c  ; 加载变量值
    %reg_bin0 = icmp slt i32 %reg_c1, 3  ; 比较小于
    %reg_forCond0 = icmp ne i1 %reg_bin0, 0  ; 比较不等于
    br i1 %reg_forCond0, label %for_body0, label %for_end0  ; 条件跳转

for_body0:
    %reg_bar4 = bitcast i32* (i32)* @foo.for0.block0.bar to i32* (i32)*
    store i32* %reg_bar4, i32** @foo.fn  ; 存储值到变量
    br label %for_inc0  ; 跳转到标签

for_inc0:
    %reg_old6 = load i32 , i32* @for0.c  ; 加载变量值
    %reg_suffix6 = add i32 %reg_old6, 1
    store i32 %reg_suffix6, i32* @for0.c  ; 存储值到变量
    br label %for_cond0  ; 跳转到标签

for_end0:
    %reg_fn8 = load i32*, i32** @foo.fn  ; 加载变量值
    ret i32* %reg_fn8  ; 返回
    }

; 函数定义
define i32 @main() {
entry:
    %main.fn = alloca i32*  ; 分配局部变量
    %reg_foo10 = bitcast i32* ()* @foo to i32* ()*
    %reg_call9 = call i32* %reg_foo10()  ; 函数调用
    store i32* %reg_call9, i32** %main.fn  ; 存储值到变量
    %main.fun = alloca i32*  ; 分配局部变量
    %reg_foo12 = bitcast i32* ()* @foo to i32* ()*
    %reg_call11 = call i32* %reg_foo12()  ; 函数调用
    store i32* %reg_call11, i32** %main.fun  ; 存储值到变量
    %reg_fn14 = load i32*, i32** %main.fn  ; 加载变量值
    call void %reg_fn14(i32 1)  ; 函数调用
    %reg_fun16 = load i32*, i32** %main.fun  ; 加载变量值
    call void %reg_fun16(i32 1)  ; 函数调用
    ret i32 23  ; 返回
    }

; 函数定义
define void @foo.for0.block0.bar(i32 %i) {
entry:
    %bar.i = alloca i32  ; 分配局部变量
    store i32 %i, i32* %bar.i  ; 存储值到变量
    %reg_c2 = load i32, i32* @for0.c  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_c2)  ; 函数调用
    %reg_i3 = load i32, i32* %bar.i  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_i3)  ; 函数调用
    ret void  ; 返回
    }
