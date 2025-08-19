; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)


    %struct.global.A = type { i32, i1 }
    %struct.global.B = type { %struct.global.A, i1 }
    @global.a = global %struct.global.A { i32 12, i1 true }
    @global.b = global %struct.global.B { %struct.global.A { i32 12, i1 true }, i1 false }

; 函数定义
define i32 @main() {
entry:
    %reg_a4 = load %struct.global.A, %struct.global.A* @global.a  ; 加载变量值
    %reg_field_age_3 = extractvalue %struct.global.A %reg_a4, 0
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_field_age_3)  ; 函数调用
    ret i32 0  ; 返回
    }