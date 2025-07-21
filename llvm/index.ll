; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"
@format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
declare i32 @printf(i8*, ...)

define void @bar_int_int_int_void_void_3(i32 %a_int_0_P, i32 %b_int_1_P, i32* %c_int_void_2_P) {
entry:
%a_int_0 = alloca i32
store i32 %a_int_0_P, i32* %a_int_0
%b_int_1 = alloca i32
store i32 %b_int_1_P, i32* %b_int_1
%c_int_void_2 = alloca i32*
store i32* %c_int_void_2_P, i32** %c_int_void_2
%reg_a_int_0_1 = load i32, i32* %a_int_0
%reg_bin_0 = icmp eq i32 %reg_a_int_0_1, 9
%reg_ifCond_0 = icmp ne i1 %reg_bin_0, 0
br i1 %reg_ifCond_0, label %if_then_0, label %if_end_0
if_then_0:
ret void
br label %if_end_0
if_end_0:
%reg_a_int_0_4 = load i32, i32* %a_int_0
%reg_b_int_1_5 = load i32, i32* %b_int_1
%reg_bin_3 = add i32 %reg_a_int_0_4, %reg_b_int_1_5
%reg_c_int_void_2_6 = load i32*, i32** %c_int_void_2
call void %reg_c_int_void_2_6(i32 %reg_bin_3)
%reg_a_int_0_9 = load i32, i32* %a_int_0
%reg_prefix_8 = add i32 %reg_a_int_0_9, 1
store i32 %reg_prefix_8, i32* %a_int_0
%reg_b_int_1_10 = load i32, i32* %b_int_1
%reg_c_int_void_2_11 = load i32*, i32** %c_int_void_2
%reg_bar_int_int_int_void_void_3_12 = bitcast void (i32, i32, i32*)* @bar_int_int_int_void_void_3 to void (i32, i32, i32*)*
call void %reg_bar_int_int_int_void_void_3_12(i32 %reg_prefix_8, i32 %reg_b_int_1_10, i32* %reg_c_int_void_2_11)
ret void
}
define i32* @call__int_int_int_void_void_4() {
entry:
%a_bool_5 = alloca i1
store i1 true, i1* %a_bool_5
%b_bool_6 = alloca i1
store i1 false, i1* %b_bool_6
store i1 false, i1* %a_bool_5
%reg_bar_int_int_int_void_void_3_0 = bitcast void (i32, i32, i32*)* @bar_int_int_int_void_void_3 to void (i32, i32, i32*)*
ret i32* %reg_bar_int_int_int_void_void_3_0
}
define void @pri_int_void_8(i32 %a_int_7_P) {
entry:
%a_int_7 = alloca i32
store i32 %a_int_7_P, i32* %a_int_7
%reg_a_int_7_0 = load i32, i32* %a_int_7
call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_a_int_7_0)
ret void
}
define void @main() {
entry:
%foo_int_int_int_void_void_10 = alloca i32*
%reg_call__int_int_int_void_void_4_1 = bitcast i32* ()* @call__int_int_int_void_void_4 to i32* ()*
%reg_call_0 = call i32* %reg_call__int_int_int_void_void_4_1()
store i32* %reg_call_0, i32** %foo_int_int_int_void_void_10
%reg_pri_int_void_8_3 = bitcast void (i32)* @pri_int_void_8 to void (i32)*
%reg_foo_int_int_int_void_void_10_4 = load i32*, i32** %foo_int_int_int_void_void_10
call void %reg_foo_int_int_int_void_void_10_4(i32 1, i32 2, i32* %reg_pri_int_void_8_3)
ret void
}
