; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"
@format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
declare i32 @printf(i8*, ...)

%A = type { i32, i32, i1 }
define i32 @main() {
entry:
%arr_arr_int_1 = alloca i32*,i32 3
%temp_0_0 = insertvalue [3 x i32] undef, i32 1, 0
%temp_1_0 = insertvalue [3 x i32] %temp_0_0, i32 3, 1
%temp_2_0 = insertvalue [3 x i32] %temp_1_0, i32 4, 2
store [3 x i32] %temp_2_0, i32* %arr_arr_int_1
ret i32 0
}
