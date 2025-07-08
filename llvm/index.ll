; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"
@format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
declare i32 @printf(i8*, ...)

define i32 @main() {
entry:
%a = alloca i32
store i32 0, i32* %a
%local_a_2 = load i32, i32* %a
%bin1 = icmp slt i32 %local_a_2, 0
%if0_cond = icmp ne i1 %bin1, 0
br i1 %if0_cond, label %if0_then, label %if0_else
if0_then:
br label %if0_end
if0_else:
%local_a_5 = load i32, i32* %a
%bin4 = icmp eq i32 %local_a_5, 0
%if3_cond = icmp ne i1 %bin4, 0
br i1 %if3_cond, label %if3_then, label %if3_else
if3_then:
br label %if3_end
if3_else:
br label %if3_end
if3_end:
br label %if0_end
if0_end:
  ret i32 0
}
