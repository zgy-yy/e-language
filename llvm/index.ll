; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)

; 函数定义
define i32 @main() {
entry:
    %a_int_0 = alloca i32  ; 分配局部变量
    store i32 12, i32* %a_int_0  ; 存储值到变量
    %local_a_int_0_2 = load i32, i32* %a_int_0  ; 加载变量值
    %bin1 = icmp sgt i32 %local_a_int_0_2, 0  ; 比较大于
    %if0_cond_val = icmp ne i1 %bin1, 0  ; 比较不等于
    br i1 %if0_cond_val, label %if0_then, label %if0_end  ; 条件跳转

if0_then:
    %local_a_int_0_3 = load i32, i32* %a_int_0  ; 加载变量值
    %print4 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %local_a_int_0_3)  ; 函数调用
    br label %if0_end  ; 跳转到标签

if0_end:
    br label %for5_init  ; 跳转到标签

for5_init:
    %a_int_1 = alloca i32  ; 分配局部变量
    store i32 0, i32* %a_int_1  ; 存储值到变量
    br label %for5_cond  ; 跳转到标签

for5_cond:
    %local_a_int_1_7 = load i32, i32* %a_int_1  ; 加载变量值
    %bin6 = icmp slt i32 %local_a_int_1_7, 12  ; 比较小于
    %for5_cond_val = icmp ne i1 %bin6, 0  ; 比较不等于
    br i1 %for5_cond_val, label %for5_body, label %for5_end  ; 条件跳转

for5_body:
    %local_a_int_1_8 = load i32, i32* %a_int_1  ; 加载变量值
    %print9 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %local_a_int_1_8)  ; 函数调用
    br label %for5_inc  ; 跳转到标签

for5_inc:
    %local_a_int_1_11 = load i32, i32* %a_int_1  ; 加载变量值
    %new10 = add i32 %local_a_int_1_11, 1
    store i32 %new10, i32* %a_int_1  ; 存储值到变量
    br label %for5_cond  ; 跳转到标签

for5_end:
    ret i32 0  ; 返回
    }
