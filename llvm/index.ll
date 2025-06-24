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
  %print0 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 1)
  ret i32 0
}
define i32 @sum(i32 %a, i32 %b) {
entry:
%c = add i32 %a, %b
  ret i32 %c
}
