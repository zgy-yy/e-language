; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)

; 函数定义
define i32 @main() {
entry:
    %a = alloca i32  ; 分配局部变量
    store i32 1, i32* %a  ; 存储值到变量
    br label %while0_cond  ; 跳转到标签

while0_cond:
    %local_a_2 = load i32, i32* %a  ; 加载变量值
    %bin1 = icmp slt i32 %local_a_2, 10  ; 比较小于
    %while0_cond_val = icmp ne i1 %bin1, 0  ; 比较不等于
    br i1 %while0_cond_val, label %while0_body, label %while0_end  ; 条件跳转

while0_body:
    %local_a_3 = load i32, i32* %a  ; 加载变量值
    %print4 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %local_a_3)  ; 函数调用
    %old5 = load i32, i32* %a  ; 加载变量值
    %new5 = add i32 %old5, 1
    store i32 %new5, i32* %a  ; 存储值到变量
    %local_a_8 = load i32, i32* %a  ; 加载变量值
    %bin7 = icmp eq i32 %local_a_8, 5  ; 比较等于
    %if6_cond = icmp ne i1 %bin7, 0  ; 比较不等于
    br i1 %if6_cond, label %if6_then, label %if6_end  ; 条件跳转

if6_then:
    br label %while0_cond  ; 跳转到标签
    br label %if6_end  ; 跳转到标签

if6_end:
    br label %while0_cond  ; 跳转到标签

while0_end:
    ret i32 0  ; 返回
    }
