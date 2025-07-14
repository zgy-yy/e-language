; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"
@format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
declare i32 @printf(i8*, ...)

define void @bar_[object Object]_0() {
entry:
call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 1)
ret void
}
define i32 @foo_[object Object]_3(i32 %a_[object Object]_1, i32 %b_[object Object]_2) {
entry:
%reg_bar_[object Object]_0_0 = bitcast void ()* @bar_[object Object]_0 to void ()*
ret i32 %reg_bar_[object Object]_0_0
}
define void @main() {
entry:
%b_[object Object]_4 = alloca i32
%reg_foo_[object Object]_3_2 = bitcast i32 (i32, i32)* @foo_[object Object]_3 to i32 (i32, i32)*
%reg_call_1 = call i32 %reg_foo_[object Object]_3_2(i32 1, i32 3)
%reg_call_0 = call undefined %reg_call_1()
store i32 %reg_call_0, i32* %b_[object Object]_4
%reg_b_[object Object]_4_3 = load i32, i32* %b_[object Object]_4
call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_b_[object Object]_4_3)
ret void
}
