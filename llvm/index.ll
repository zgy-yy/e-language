; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"
@format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
declare i32 @printf(i8*, ...)


%struct.global.A = type { i32, i32, i32 }
%struct.global.B = type { i32 }
define i32 @main() {
entry:
%main.age = alloca i32
store i32 23, i32* %main.age
ret i32 1
}