; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"
@format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
declare i32 @printf(i8*, ...)

@a = global i32 1
@b = global i32 4
@c = global i32 3
define i32 @main() {
entry:
%d = alloca i32
  %global_c = load i32, i32* @c
  %bin0 = add i32 1, %global_c
  %global_a = load i32, i32* @a
  %bin1 = add i32 %bin0, %global_a
  %bin2 = add i32 %bin1, 1
store i32 %bin2, i32* %d
 %local_d = load i32, i32* %d
  %print3 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %local_d)
  ret i32 0
}
