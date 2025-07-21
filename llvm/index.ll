; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"
@format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
declare i32 @printf(i8*, ...)

define void @bar_int_void_1(i32 %a_int_0) {
entry:
%reg_bin_0 = icmp eq i32 %a_int_0, 9
%reg_ifCond_0 = icmp ne i1 %reg_bin_0, 0
br i1 %reg_ifCond_0, label %if_then_0, label %if_end_0
if_then_0:
ret void
br label %if_end_0
if_end_0:
call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %a_int_0)
%reg_bin_4 = add i32 %a_int_0, 1
%reg_bar_int_void_1_6 = bitcast void (i32)* @bar_int_void_1 to void (i32)*
call void %reg_bar_int_void_1_6(i32 %reg_bin_4)
ret void
}
define i32* @call__int_void_2() {
entry:
%a_bool_3 = alloca i1
store i1 true, i1* %a_bool_3
%b_bool_4 = alloca i1
store i1 false, i1* %b_bool_4
store i1 false, i1* %a_bool_3
%reg_bar_int_void_1_0 = bitcast void (i32)* @bar_int_void_1 to void (i32)*
ret i32* %reg_bar_int_void_1_0
}
define void @main() {
entry:
%foo_int_void_6 = alloca i32*
%reg_call__int_void_2_1 = bitcast i32* ()* @call__int_void_2 to i32* ()*
%reg_call_0 = call i32* %reg_call__int_void_2_1()
store i32* %reg_call_0, i32** %foo_int_void_6
%reg_foo_int_void_6_3 = load i32*, i32** %foo_int_void_6
call void %reg_foo_int_void_6_3(i32 1)
%reg_call__int_void_2_6 = bitcast i32* ()* @call__int_void_2 to i32* ()*
%reg_call_5 = call i32* %reg_call__int_void_2_6()
call void %reg_call_5(i32 1)
ret void
}
