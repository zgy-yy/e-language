; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"
@format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
declare i32 @printf(i8*, ...)

define i32 @main() {
entry:
%a = alloca i32
store i32 12, i32* %a
%b = alloca i1
%local_a_1 = load i32, i32* %a
%bin0 = icmp sgt i32 %local_a_1, 1
store i1 %bin0, i1* %b
%local_b_2 = load i1, i1* %b
%print3 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i1 %local_b_2)
%local_a_4 = load i32, i32* %a
%print5 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %local_a_4)
  ret i32 0
}
