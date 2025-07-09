; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"
@format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
declare i32 @printf(i8*, ...)

define i32 @main() {
entry:
%a = alloca i32
store i32 12, i32* %a
%b = alloca i32
%local_a_2 = load i32, i32* %a
%new1 = add i32 %local_a_2, 1
store i32 %new1, i32* %a
%unary3 = sub i32 0, %new1
%bin0 = add i32 %unary3, 1
store i32 %bin0, i32* %b
%local_a_4 = load i32, i32* %a
%print5 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %local_a_4)
%local_b_6 = load i32, i32* %b
%print7 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %local_b_6)
%c = alloca i1
store i1 true, i1* %c
%d = alloca i1
%local_c_8 = load i1, i1* %c
%unary9 = icmp eq i1 %local_c_8, 0
%unary10 = icmp eq i1 %unary9, 0
%unary11 = icmp eq i1 %unary10, 0
%unary12 = icmp eq i1 %unary11, 0
%unary13 = icmp eq i1 %unary12, 0
store i1 %unary13, i1* %d
%local_d_14 = load i1, i1* %d
%print15 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i1 %local_d_14)
  ret i32 0
}
