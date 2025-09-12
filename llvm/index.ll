; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"
@format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
declare i32 @printf(i8*, ...)


define i32 @main() {
entry:
%main.foo = alloca i32*
store i32* @anonymous.13F9, i32** %main.foo
%reg_foo6 = load i32*, i32** %main.foo
call void %reg_foo6(i32* @fo.377F, i1 true)
ret i32 0
}
define void @fo.377F(i32 %c) {
entry:
%fo.377F.c = alloca i32
store i32 %c, i32* %fo.377F.c
%reg_c7 = load i32, i32* %fo.377F.c
call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_c7)
ret void
}
define void @anonymous.13F9 (i32* %fc, i1 %b) {
entry:
%anonymous.13F9.fc = alloca i32*
store i32* %fc, i32** %anonymous.13F9.fc
%anonymous.13F9.b = alloca i1
store i1 %b, i1* %anonymous.13F9.b
%reg_b1 = load i1, i1* %anonymous.13F9.b
%reg_ifCond0 = icmp ne i1 %reg_b1, 0
br i1 %reg_ifCond0, label %if_then0, label %if_end0
if_then0:
%reg_fc3 = load i32*, i32** %anonymous.13F9.fc
call void %reg_fc3(i32 23)
br label %if_end0
if_end0:
ret void
}
