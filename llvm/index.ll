; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"
@format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
declare i32 @printf(i8*, ...)


%struct.global.St = type { i32 }
define i32 @foo() {
entry:
ret i32 23
}
define %struct.global.St @bar() {
entry:
%bar.s = alloca %struct.global.St
%reg_foo2 = bitcast i32* ()* @foo to i32* ()*
%reg_call1 = call i32 %reg_foo2()
%temp_struct0_a = insertvalue %struct.global.St undef, i32 %reg_call1, 0
store %struct.global.St %temp_struct0_a, %struct.global.St* %bar.s
%reg_s3 = load %struct.global.St, %struct.global.St* %bar.s
ret %struct.global.St %reg_s3
}
define i32 @main() {
entry:
%main.s = alloca %struct.global.St
%reg_bar5 = bitcast i32* ()* @bar to i32* ()*
%reg_call4 = call %struct.global.St %reg_bar5()
store %struct.global.St %reg_call4, %struct.global.St* %main.s
%reg_s7 = load %struct.global.St, %struct.global.St* %main.s
%reg_fielda_6 = extractvalue %struct.global.St %reg_s7, 0
call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_fielda_6)
ret i32 23
}

