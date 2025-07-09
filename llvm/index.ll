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
    br label %loop0_body  ; 跳转到标签

loop0_body:
    %old1 = load i32, i32* %a  ; 加载变量值
    %new1 = add i32 %old1, 1
    store i32 %new1, i32* %a  ; 存储值到变量
    %local_a_4 = load i32, i32* %a  ; 加载变量值
    %bin3 = icmp eq i32 %local_a_4, 5  ; 比较等于
    %if2_cond = icmp ne i1 %bin3, 0  ; 比较不等于
    br i1 %if2_cond, label %if2_then, label %if2_end  ; 条件跳转

if2_then:
    br label %loop0_body  ; 跳转到标签
    br label %if2_end  ; 跳转到标签

if2_end:
    %local_a_5 = load i32, i32* %a  ; 加载变量值
    %print6 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %local_a_5)  ; 函数调用
    %local_a_9 = load i32, i32* %a  ; 加载变量值
    %bin8 = icmp eq i32 %local_a_9, 10  ; 比较等于
    %if7_cond = icmp ne i1 %bin8, 0  ; 比较不等于
    br i1 %if7_cond, label %if7_then, label %if7_end  ; 条件跳转

if7_then:
    br label %loop0_end  ; 跳转到标签
    br label %if7_end  ; 跳转到标签

if7_end:
    br label %loop0_body  ; 跳转到标签

loop0_end:
    ret i32 0  ; 返回
    }
