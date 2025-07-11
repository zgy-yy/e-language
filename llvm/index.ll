; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)

; 函数定义
define i32 @foo_fun_5(i32 %a_int_0, i32 %b_int_1) {
entry:
    br label %for_init_0  ; 跳转到标签

for_init_0:
    %i_int_2 = alloca i32  ; 分配局部变量
    store i32 0, i32* %i_int_2  ; 存储值到变量
    br label %for_cond_0  ; 跳转到标签

for_cond_0:
    %reg_i_int_2_1 = load i32, i32* %i_int_2  ; 加载变量值
    %reg_bin_0 = icmp slt i32 %reg_i_int_2_1, 23  ; 比较小于
    %reg_forCond_0 = icmp ne i1 %reg_bin_0, 0  ; 比较不等于
    br i1 %reg_forCond_0, label %for_body_0, label %for_end_0  ; 条件跳转

for_body_0:
    %i_int_3 = alloca i32  ; 分配局部变量
    store i32 0, i32* %i_int_3  ; 存储值到变量
    %c_int_4 = alloca i32  ; 分配局部变量
    store i32 0, i32* %c_int_4  ; 存储值到变量
    %reg_i_int_3_2 = load i32, i32* %i_int_3  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_i_int_3_2)  ; 函数调用
    %reg_c_int_4_3 = load i32, i32* %c_int_4  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_c_int_4_3)  ; 函数调用
    br label %for_inc_0  ; 跳转到标签

for_inc_0:
    %reg_i_int_2_5 = load i32, i32* %i_int_2  ; 加载变量值
    %reg_suffix_4 = add i32 %reg_i_int_2_5, 1
    store i32 %reg_suffix_4, i32* %i_int_2  ; 存储值到变量
    br label %for_cond_0  ; 跳转到标签

for_end_0:
    %reg_bin_6 = add i32 %a_int_0, %b_int_1
    ret i32 %reg_bin_6  ; 返回
    }

; 函数定义
define void @main() {
entry:
    %b_int_6 = alloca i32  ; 分配局部变量
    %reg_foo_fun_5_1 = bitcast i32 (i32, i32)* @foo_fun_5 to i32 (i32, i32)*
    %reg_call_0 = call i32 %reg_foo_fun_5_1(i32 1, i32 3)  ; 函数调用
    store i32 %reg_call_0, i32* %b_int_6  ; 存储值到变量
    %reg_b_int_6_2 = load i32, i32* %b_int_6  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_b_int_6_2)  ; 函数调用
    ret void  ; 返回
    }
