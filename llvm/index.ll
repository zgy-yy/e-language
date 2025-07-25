; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"
@format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
declare i32 @printf(i8*, ...)

%A = type { i32, i32, i1 }
%B = type { i32, %A }
define i32 @main() {
entry:
%ha_struct_B_1 = alloca %B
%reg_struct_0 = alloca %B
%regptr_i_0 = getelementptr inbounds %B, %B* %reg_struct_0, i32 0, i32 0
store i32 43, i32* %regptr_i_0
%reg_struct_1 = alloca %A
%regptr_a_1 = getelementptr inbounds %A, %A* %reg_struct_1, i32 0, i32 0
store i32 1, i32* %regptr_a_1
%regptr_c_1 = getelementptr inbounds %A, %A* %reg_struct_1, i32 0, i32 2
store i1 true, i1* %regptr_c_1
%regptr_b_1 = getelementptr inbounds %A, %A* %reg_struct_1, i32 0, i32 1
store i32 6, i32* %regptr_b_1
%reg_struct_1_load = load %A, %A* %reg_struct_1
%regptr_a_0 = getelementptr inbounds %B, %B* %reg_struct_0, i32 0, i32 1
store %A %reg_struct_1_load, %A* %regptr_a_0
%reg_struct_0_load = load %B, %B* %reg_struct_0
store %B %reg_struct_0_load, %B* %ha_struct_B_1
%regptr_a_3 = getelementptr inbounds %B, %B* %ha_struct_B_1, i32 0, i32 1
%regptr_b_2 = getelementptr inbounds %A, %A* %regptr_a_3, i32 0, i32 1
%regptr_b_2_load = load i32, i32* %regptr_b_2
call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %regptr_b_2_load)
ret i32 0
}
