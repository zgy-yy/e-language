; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"
@format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
declare i32 @printf(i8*, ...)

define i32 @main() {
entry:
%a = alloca i32
store i32 1, i32* %a
br label %while0_start_cond
while0_start_cond:
%local_a_2 = load i32, i32* %a
%bin1 = icmp slt i32 %local_a_2, 10
%while0_cond_val = icmp ne i1 %bin1, 0
br i1 %while0_cond_val, label %while0_body, label %while0_end
while0_body:
%local_a_4 = load i32, i32* %a
%bin3 = add i32 %local_a_4, 1
  store i32 %bin3, i32* %a
br label %while0_end
br label %while0_start_cond
while0_end:
%local_a_5 = load i32, i32* %a
%print6 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %local_a_5)
  ret i32 0
}
