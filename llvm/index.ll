; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"
@format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
declare i32 @printf(i8*, ...)


define i32 @main() {
entry:
%main.tup = alloca {i32,i1}
%temp_tuple0_0 = insertvalue {i32,i1} undef, i32 1, 0
%temp_tuple0_1 = insertvalue {i32,i1} %temp_tuple0_0, i1 true, 1
store {i32,i1} %temp_tuple0_1, {i32,i1}* %main.tup
%main.c = alloca [4 x i32]
%temp_arr1_0 = insertvalue [4 x i32] undef, i32 1, 0
%temp_arr1_1 = insertvalue [4 x i32] %temp_arr1_0, i32 2, 1
%temp_arr1_2 = insertvalue [4 x i32] %temp_arr1_1, i32 3, 2
%temp_arr1_3 = insertvalue [4 x i32] %temp_arr1_2, i32 4, 3
store [4 x i32] %temp_arr1_3, [4 x i32]* %main.c
ret i32 0
}