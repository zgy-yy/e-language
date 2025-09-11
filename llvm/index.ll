; 目标平台为 ARM64 macOS
target triple = "arm64-apple-macosx"
@format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
declare i32 @printf(i8*, ...)


@global.a = global i32 23
@global.fo = global i32* @anonymous.5CC7
%struct.global.STU = type { i32, i1 }
@main.i = global i32 zeroinitializer
define void @anonymous.5CC7 (i32 %i) {
entry:
%anonymous.5CC7.i = alloca i32
store i32 %i, i32* %anonymous.5CC7.i
ret void
}
define i32 @fun.D1CA(i32 %a) {
entry:
%fun.D1CA.a = alloca i32
store i32 %a, i32* %fun.D1CA.a
ret i32 123
}
define i32 @main() {
entry:
%reg_fo2 = load i32*, i32** @global.fo
call void %reg_fo2(i32 1)
%reg_call3 = call i32 @fun.D1CA(i32 1)
%main.s = alloca %struct.global.STU
%temp_struct5_age = insertvalue %struct.global.STU undef, i32 19, 0
%temp_struct5_sex = insertvalue %struct.global.STU %temp_struct5_age, i1 false, 1
store %struct.global.STU %temp_struct5_sex, %struct.global.STU* %main.s
%reg_fieldage_6 = getelementptr %struct.global.STU, %struct.global.STU* %main.s, i32 0, i32 0
store i32 23, i32* %reg_fieldage_6
%main.arr = alloca [3 x i32]
%temp_arr8_0 = insertvalue [3 x i32] undef, i32 1, 0
%temp_arr8_1 = insertvalue [3 x i32] %temp_arr8_0, i32 2, 1
%temp_arr8_2 = insertvalue [3 x i32] %temp_arr8_1, i32 3, 2
store [3 x i32] %temp_arr8_2, [3 x i32]* %main.arr
%main.a = alloca i32
store i32 1, i32* %main.a
%main.ptr = alloca i32*
%reg_a9 = load i32, i32* %main.a
store i32* %reg_a9, i32** %main.ptr
%reg_a11 = load i32, i32* %main.a
%reg_bin10 = icmp sgt i32 %reg_a11, 23
%reg_ifCond0 = icmp ne i1 %reg_bin10, 0
br i1 %reg_ifCond0, label %if_then0, label %if_else0
if_then0:
call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 23)
br label %if_end0
if_else0:
call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 12)
br label %if_end0
if_end0:
br label %for_init0
for_init0:
%for0.i = alloca i32
store i32 3, i32* %for0.i
br label %for_cond0
for_cond0:
%reg_i13 = load i32, i32* %for0.i
%reg_bin12 = icmp slt i32 %reg_i13, 24
%reg_forCond0 = icmp ne i1 %reg_bin12, 0
br i1 %reg_forCond0, label %for_body0, label %for_end0
for_body0:
br label %for_inc0
for_inc0:
%reg_old14 = load i32 , i32* %for0.i
%reg_suffix14 = add i32 %reg_old14, 1
store i32 %reg_suffix14, i32* %for0.i
br label %for_cond0
for_end0:
br label %do_body0
do_body0:
store i32 1, i32* %main.a
br label %do_cond0
do_cond0:
%reg_a18 = load i32, i32* %main.a
%reg_bin17 = icmp sgt i32 %reg_a18, 34
%reg_doCond0 = icmp ne i1 %reg_bin17, 0
br i1 %reg_doCond0, label %do_body0, label %do_end0
do_end0:
br label %loop_body0
loop_body0:
br label %loop_body0
loop_end0:
store i32 0, i32* @main.i
%main.cf = alloca i32*
store i32* @anonymous.213E, i32** %main.cf
br label %while_cond0
while_cond0:
%reg_i23 = load i32, i32* @main.i
%reg_bin22 = icmp slt i32 %reg_i23, 23
%reg_whileCond0 = icmp ne i1 %reg_bin22, 0
br i1 %reg_whileCond0, label %while_body0, label %while_end0
while_body0:
%reg_i25 = load i32, i32* @main.i
%reg_bin24 = icmp eq i32 %reg_i25, 23
%reg_ifCond1 = icmp ne i1 %reg_bin24, 0
br i1 %reg_ifCond1, label %if_then1, label %if_end1
if_then1:
br label %while_end0
br label %if_end1
if_end1:
br label %while_cond0
while_end0:
ret i32 12
}
define void @fa.7D06() {
entry:
ret void
}
define void @anonymous.213E () {
entry:
%reg_old20 = load i32 , i32* @main.i
%reg_suffix20 = add i32 %reg_old20, 1
store i32 %reg_suffix20, i32* @main.i
ret void
}


