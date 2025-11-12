; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)


    %struct.global.A = type { i32, i32, i32 }
    %struct.global.B = type { i32 }

; 函数定义
define i32 @main() {
entry:
    %main.a = alloca %struct.global.A*  ; 分配局部变量
    store %struct.global.A* zeroinitializer, %struct.global.A** %main.a  ; 存储值到变量
    ret i32 1  ; 返回
    }