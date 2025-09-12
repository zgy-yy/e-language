; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"
@format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
declare i32 @printf(i8*, ...)


define i32 @main() {
entry:
%main.a = alloca i32
store i32 zeroinitializer, i32* %main.a
ret i32 0
}