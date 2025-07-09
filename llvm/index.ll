; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"
@format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
declare i32 @printf(i8*, ...)

define i32 @main() {
entry:
%a = alloca i32
store i32 1, i32* %a
%b = alloca i32
%c = alloca i32
store i32 3, i32* %c
  br label %for0_init
for0_init:
%d = alloca i32
store i32 1, i32* %d
br label %for0_cond
for0_cond:
%local_a_2 = load i32, i32* %a
%bin1 = icmp slt i32 %local_a_2, 10
  %for0_cond_val = icmp ne i32 %bin1, 0
  br i1 %for0_cond_val, label %for0_body, label %for0_end
for0_body:
%local_a_4 = load i32, i32* %a
%bin3 = add i32 %local_a_4, 1
%print5 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %bin3)
  br label %for0_inc
for0_inc:
%old6 = load i32, i32* %a
%new6 = add i32 %old6, 1
store i32 %new6, i32* %a
  br label %for0_cond
for0_end:
  ret i32 0
}
