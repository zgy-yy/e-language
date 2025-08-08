; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"
@format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
declare i32 @printf(i8*, ...)

%A = type { i32, i32, i1 }
define i32 @main() {
entry:
%a_int_1 = alloca i32
store i32 0, i32* %a_int_1
store i32 12, i32* %a_int_1
%c_arr_int_2 = alloca [2 x i32]
%temp_0_0 = insertvalue [2 x i32] undef, i32 1, 0
%temp_1_0 = insertvalue [2 x i32] %temp_0_0, i32 2, 1
store [2 x i32] %temp_1_0, [2 x i32]* %c_arr_int_2
%reg_c_arr_int_2_2 = load [2 x i32], [2 x i32]* %c_arr_int_2
%reg_elemPtr_1 = getelementptr [2 x i32], [2 x i32]* %reg_c_arr_int_2_2,i32 0, i32 0
store i32 12, i32* %reg_elemPtr_1
%reg_c_arr_int_2_4 = load [2 x i32], [2 x i32]* %c_arr_int_2
%temp_arr_alloca3 = alloca [2 x i32]
store [2 x i32] %reg_c_arr_int_2_4, [2 x i32]* %temp_arr_alloca3
%reg_index_3_1 = getelementptr [2 x i32], [2 x i32]* %temp_arr_alloca3,i32 0, i32 1
%reg_index_3 = load i32, i32* %reg_index_3_1
call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_index_3)
ret i32 0
}
