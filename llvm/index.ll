; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"
@format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
declare i32 @printf(i8*, ...)

define void @bar()->void_0() {
entry:
call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 1)
ret void
}
define i32 @foo(int_int)->()->void_3(i32 %aint_1, i32 %bint_2) {
entry:
%reg_bar()->void_0_0 = bitcast void ()* @bar()->void_0 to void ()*
ret i32 %reg_bar()->void_0_0
}
define void @main() {
entry:
%func()->void_4 = alloca i32
%reg_bar()->void_0_0 = bitcast void ()* @bar()->void_0 to void ()*
store i32 %reg_bar()->void_0_0, i32* %func()->void_4
%bvoid_5 = alloca void
%reg_foo(int_int)->()->void_3_3 = bitcast i32 (i32, i32)* @foo(int_int)->()->void_3 to i32 (i32, i32)*
%reg_call_2 = call i32 %reg_foo(int_int)->()->void_3_3(i32 1, i32 3)
%reg_call_1 = call void %reg_call_2()
store void %reg_call_1, void* %bvoid_5
%reg_bvoid_5_4 = load void, void* %bvoid_5
call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), void %reg_bvoid_5_4)
ret void
}
