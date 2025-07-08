; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)

; 函数定义
define i32 @main() {
entry:
    %a = alloca i32  ; 分配局部变量
    store i32 12, i32* %a  ; 存储值到变量
    %local_a_2 = load i32, i32* %a  ; 加载变量值
    %bin1 = icmp sgt i32 %local_a_2, 0  ; 比较大于
    %if0_cond = icmp ne i1 %bin1, 0  ; 比较不等于
    br i1 %if0_cond, label %if0_then, label %if0_end  ; 条件跳转

if0_then:
    %print3 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 1)  ; 函数调用
    br label %break  ; 跳转到标签
    %local_a_6 = load i32, i32* %a  ; 加载变量值
    %bin5 = icmp sgt i32 %local_a_6, 2  ; 比较大于
    %if4_cond = icmp ne i1 %bin5, 0  ; 比较不等于
    br i1 %if4_cond, label %if4_then, label %if4_end  ; 条件跳转

if4_then:
    %local_a_7 = load i32, i32* %a  ; 加载变量值
    %print8 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %local_a_7)  ; 函数调用
    br label %if4_end  ; 跳转到标签

if4_end:
    br label %if0_end  ; 跳转到标签

if0_end:
    ret i32 0  ; 返回
    }
