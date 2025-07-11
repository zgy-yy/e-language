; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"
@format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
declare i32 @printf(i8*, ...)

define i32 @foo_fun_0() {
entry:
ret i32 1
}
define void @main() {
entry:
%b_int_1 = alloca i32
%call_var0 = call i32 @foo_fun_0()
store i32 %call_var0, i32* %b_int_1
%local_b_int_1_2 = load i32, i32* %b_int_1
%print3 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %local_b_int_1_2)
ret void
}
