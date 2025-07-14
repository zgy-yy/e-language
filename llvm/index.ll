; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"
@format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
declare i32 @printf(i8*, ...)

define void @bar_fun_0() {
entry:
call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 1)
ret void
}
define i32 @foo_fun_3(i32 %a_int_1, i32 %b_int_2) {
entry:
%reg_bar_fun_0_0 = bitcast void ()* @bar_fun_0 to void ()*
ret undefined %reg_bar_fun_0_0
}
define void @main() {
entry:
%b_int_4 = alloca i32
%reg_foo_fun_3_2 = bitcast i32 (i32, i32)* @foo_fun_3 to i32 (i32, i32)*
%reg_call_1 = call i32 %reg_foo_fun_3_2(i32 1, i32 3)
%reg_call_0 = call undefined %reg_call_1()
store i32 %reg_call_0, i32* %b_int_4
%reg_b_int_4_3 = load i32, i32* %b_int_4
call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_b_int_4_3)
ret void
}
