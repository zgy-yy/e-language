; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"
@format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
declare i32 @printf(i8*, ...)

%A = type { i32, i32, i1 }
define i32 @main() {
entry:
%st_struct_A_1 = alloca %A
%reg_struct_0 = alloca %A
%regptr_a_0 = getelementptr inbounds %A, %A* %reg_struct_0, i32 0, i32 0
store i32 1, i32* %regptr_a_0
%regptr_b_0 = getelementptr inbounds %A, %A* %reg_struct_0, i32 0, i32 1
store i32 2, i32* %regptr_b_0
%regptr_c_0 = getelementptr inbounds %A, %A* %reg_struct_0, i32 0, i32 2
store i1 true, i1* %regptr_c_0
%reg_struct_0_load = load %A, %A* %reg_struct_0
store %A %reg_struct_0_load, %A* %st_struct_A_1
ret i32 0
}
