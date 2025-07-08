; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"
@format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
declare i32 @printf(i8*, ...)

define i32 @main() {
entry:
%a = alloca i32
store i32 1, i32* %a
%b = alloca i32
 %local_a = load i32, i32* %a
%bin0 = icmp sgt i32 %local_a, 0
store i32 %bin0, i32* %b
 %local_b = load i32, i32* %b
  %print1 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %local_b)
  ret i32 0
}
