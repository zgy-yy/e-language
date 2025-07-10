; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"
@format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
declare i32 @printf(i8*, ...)

define i32 @main() {
entry:
%a_int_0 = alloca i32
store i32 1, i32* %a_int_0
%local_a_int_0_0 = load i32, i32* %a_int_0
%print1 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %local_a_int_0_0)
%local_a_int_0_2 = load i32, i32* %a_int_0
  ret i32 %local_a_int_0_2
}
define void @foo() {
entry:
%a_int_2 = alloca i32
store i32 2, i32* %a_int_2
  ret undefined 0
}
