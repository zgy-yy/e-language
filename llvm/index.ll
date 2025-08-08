; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)

    %A = type { i32, i32, i1 }

; 函数定义
define i32 @main() {
entry:
    %a_1 = alloca i32  ; 分配局部变量
    store i32 0, i32* %a_1  ; 存储值到变量
    %a_1_reg_1 = load i32, i32* %a_1  ; 加载变量值
    %reg_bin_0 = add i32 %a_1_reg_1, 1
    store i32 %reg_bin_0, i32* %a_1  ; 存储值到变量
    br label %for_init_0  ; 跳转到标签

for_init_0:
    %a_2 = alloca i32  ; 分配局部变量
    store i32 1, i32* %a_2  ; 存储值到变量
    br label %for_cond_0  ; 跳转到标签

for_cond_0:
    %a_2_reg_3 = load i32, i32* %a_2  ; 加载变量值
    %reg_bin_2 = icmp slt i32 %a_2_reg_3, 2  ; 比较小于
    %reg_forCond_0 = icmp ne i1 %reg_bin_2, 0  ; 比较不等于
    br i1 %reg_forCond_0, label %for_body_0, label %for_end_0  ; 条件跳转

for_body_0:
    %a_2_reg_4 = load i32, i32* %a_2  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %a_2_reg_4)  ; 函数调用
    br label %for_inc_0  ; 跳转到标签

for_inc_0:
    %a_2_reg_6 = load i32, i32* %a_2  ; 加载变量值
    %reg_suffix_5 = add i32 %a_2_reg_6, 1
    store i32 %reg_suffix_5, i32* %a_2  ; 存储值到变量
    br label %for_cond_0  ; 跳转到标签

for_end_0:
    %a_1_reg_8 = load i32, i32* %a_1  ; 加载变量值
    %reg_bin_7 = icmp sgt i32 %a_1_reg_8, 4  ; 比较大于
    %reg_ifCond_0 = icmp ne i1 %reg_bin_7, 0  ; 比较不等于
    br i1 %reg_ifCond_0, label %if_then_0, label %if_else_0  ; 条件跳转

if_then_0:
    %a_1_reg_9 = load i32, i32* %a_1  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %a_1_reg_9)  ; 函数调用
    br label %if_end_0  ; 跳转到标签

if_else_0:
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 2)  ; 函数调用
    br label %if_end_0  ; 跳转到标签

if_end_0:
    br label %while_cond_0  ; 跳转到标签

while_cond_0:
    %a_1_reg_11 = load i32, i32* %a_1  ; 加载变量值
    %reg_bin_10 = icmp slt i32 %a_1_reg_11, 12  ; 比较小于
    %reg_whileCond_0 = icmp ne i1 %reg_bin_10, 0  ; 比较不等于
    br i1 %reg_whileCond_0, label %while_body_0, label %while_end_0  ; 条件跳转

while_body_0:
    %a_1_reg_13 = load i32, i32* %a_1  ; 加载变量值
    %reg_suffix_12 = add i32 %a_1_reg_13, 1
    store i32 %reg_suffix_12, i32* %a_1  ; 存储值到变量
    %a_1_reg_14 = load i32, i32* %a_1  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %a_1_reg_14)  ; 函数调用
    br label %while_cond_0  ; 跳转到标签

while_end_0:
    br label %do_body_0  ; 跳转到标签

do_body_0:
    %a_1_reg_15 = load i32, i32* %a_1  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %a_1_reg_15)  ; 函数调用
    %a_1_reg_17 = load i32, i32* %a_1  ; 加载变量值
    %reg_bin_16 = add i32 %a_1_reg_17, 1
    store i32 %reg_bin_16, i32* %a_1  ; 存储值到变量
    br label %do_cond_0  ; 跳转到标签

do_cond_0:
    %a_1_reg_19 = load i32, i32* %a_1  ; 加载变量值
    %reg_bin_18 = icmp slt i32 %a_1_reg_19, 15  ; 比较小于
    %reg_doCond_0 = icmp ne i1 %reg_bin_18, 0  ; 比较不等于
    br i1 %reg_doCond_0, label %do_body_0, label %do_end_0  ; 条件跳转

do_end_0:
    %st_10 = alloca %A  ; 分配局部变量
    %temp_20_a = insertvalue %A undef, i32 1, 0
    %temp_20_b = insertvalue %A %temp_20_a, i32 23, 1
    %temp_20_c = insertvalue %A %temp_20_b, i1 true, 2
    store %A %temp_20_c, %A* %st_10  ; 存储值到变量
    %st_10_reg_24 = load %A, %A* %st_10  ; 加载变量值
    %regfield_a_23 = extractvalue %A %st_10_reg_24, 0
    %reg_bin_22 = add i32 %regfield_a_23, 23
    %st_10_reg_25 = load %A, %A* %st_10  ; 加载变量值
    %temp_a_21 = insertvalue %A %st_10_reg_25, i32 %reg_bin_22, 0
    store %A %temp_a_21, %A* %st_10  ; 存储值到变量
    %st_10_reg_28 = load %A, %A* %st_10  ; 加载变量值
    %regfield_a_27 = extractvalue %A %st_10_reg_28, 0
    %reg_suffix_26 = add i32 %regfield_a_27, 1
    store i32 %reg_suffix_26, i32* null  ; 存储值到变量
    %st_10_reg_30 = load %A, %A* %st_10  ; 加载变量值
    %regfield_a_29 = extractvalue %A %st_10_reg_30, 0
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %regfield_a_29)  ; 函数调用
    ret i32 0  ; 返回
    }
