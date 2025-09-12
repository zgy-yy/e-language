; 目标平台为 ARM64 macOS
    target triple = "arm64-apple-macosx"
    @format = private unnamed_addr constant [25 x i8] c"in llvm fun, value = %d\0A\00"
; 声明 printf 函数
    declare i32 @printf(i8*, ...)


; 函数定义
define i32 @main() {
entry:
    %main.arr1 = alloca [3 x i32]  ; 分配局部变量
    %temp_arr0_0 = insertvalue [3 x i32] undef, i32 1, 0
    %temp_arr0_1 = insertvalue [3 x i32] %temp_arr0_0, i32 2, 1
    %temp_arr0_2 = insertvalue [3 x i32] %temp_arr0_1, i32 3, 2
    store [3 x i32] %temp_arr0_2, [3 x i32]* %main.arr1  ; 存储值到变量
    %main.arr2 = alloca [5 x i32]  ; 分配局部变量
    %temp_arr1_0 = insertvalue [5 x i32] undef, i32 10, 0
    %temp_arr1_1 = insertvalue [5 x i32] %temp_arr1_0, i32 20, 1
    %temp_arr1_2 = insertvalue [5 x i32] %temp_arr1_1, i32 30, 2
    %temp_arr1_3 = insertvalue [5 x i32] %temp_arr1_2, i32 40, 3
    %temp_arr1_4 = insertvalue [5 x i32] %temp_arr1_3, i32 50, 4
    store [5 x i32] %temp_arr1_4, [5 x i32]* %main.arr2  ; 存储值到变量
    %main.arr3 = alloca [2 x i32]  ; 分配局部变量
    %temp_arr2_0 = insertvalue [2 x i32] undef, i32 100, 0
    %temp_arr2_1 = insertvalue [2 x i32] %temp_arr2_0, i32 200, 1
    store [2 x i32] %temp_arr2_1, [2 x i32]* %main.arr3  ; 存储值到变量
    %main.empty_arr = alloca [0 x i32]  ; 分配局部变量
    store [0 x i32] undef, [0 x i32]* %main.empty_arr  ; 存储值到变量
    %main.first_element = alloca i32  ; 分配局部变量
    %reg_arr15 = load [3 x i32], [3 x i32]* %main.arr1  ; 加载变量值
    %temp_arr4 = alloca [3 x i32]  ; 分配局部变量
    store [3 x i32] %reg_arr15, [3 x i32]* %temp_arr4  ; 存储值到变量
    %reg_index_ptr4 = getelementptr [3 x i32], [3 x i32]* %temp_arr4,i32 0, i32 0  ; 获取数组元素指针
    %reg_index4 = load i32, i32* %reg_index_ptr4  ; 加载变量值
    store i32 %reg_index4, i32* %main.first_element  ; 存储值到变量
    %main.second_element = alloca i32  ; 分配局部变量
    %reg_arr17 = load [3 x i32], [3 x i32]* %main.arr1  ; 加载变量值
    %temp_arr6 = alloca [3 x i32]  ; 分配局部变量
    store [3 x i32] %reg_arr17, [3 x i32]* %temp_arr6  ; 存储值到变量
    %reg_index_ptr6 = getelementptr [3 x i32], [3 x i32]* %temp_arr6,i32 0, i32 1  ; 获取数组元素指针
    %reg_index6 = load i32, i32* %reg_index_ptr6  ; 加载变量值
    store i32 %reg_index6, i32* %main.second_element  ; 存储值到变量
    %main.third_element = alloca i32  ; 分配局部变量
    %reg_arr19 = load [3 x i32], [3 x i32]* %main.arr1  ; 加载变量值
    %temp_arr8 = alloca [3 x i32]  ; 分配局部变量
    store [3 x i32] %reg_arr19, [3 x i32]* %temp_arr8  ; 存储值到变量
    %reg_index_ptr8 = getelementptr [3 x i32], [3 x i32]* %temp_arr8,i32 0, i32 2  ; 获取数组元素指针
    %reg_index8 = load i32, i32* %reg_index_ptr8  ; 加载变量值
    store i32 %reg_index8, i32* %main.third_element  ; 存储值到变量
    %main.last_element = alloca i32  ; 分配局部变量
    %reg_arr211 = load [5 x i32], [5 x i32]* %main.arr2  ; 加载变量值
    %temp_arr10 = alloca [5 x i32]  ; 分配局部变量
    store [5 x i32] %reg_arr211, [5 x i32]* %temp_arr10  ; 存储值到变量
    %reg_index_ptr10 = getelementptr [5 x i32], [5 x i32]* %temp_arr10,i32 0, i32 4  ; 获取数组元素指针
    %reg_index10 = load i32, i32* %reg_index_ptr10  ; 加载变量值
    store i32 %reg_index10, i32* %main.last_element  ; 存储值到变量
    %reg_index_ptr12 = getelementptr [3 x i32], [3 x i32]* %main.arr1,i32 0, i32 0  ; 获取数组元素指针
    store i32 100, i32* %reg_index_ptr12  ; 存储值到变量
    %reg_index_ptr14 = getelementptr [3 x i32], [3 x i32]* %main.arr1,i32 0, i32 1  ; 获取数组元素指针
    store i32 200, i32* %reg_index_ptr14  ; 存储值到变量
    %reg_index_ptr16 = getelementptr [3 x i32], [3 x i32]* %main.arr1,i32 0, i32 2  ; 获取数组元素指针
    store i32 300, i32* %reg_index_ptr16  ; 存储值到变量
    %main.sum_first_two = alloca i32  ; 分配局部变量
    %reg_arr120 = load [3 x i32], [3 x i32]* %main.arr1  ; 加载变量值
    %temp_arr19 = alloca [3 x i32]  ; 分配局部变量
    store [3 x i32] %reg_arr120, [3 x i32]* %temp_arr19  ; 存储值到变量
    %reg_index_ptr19 = getelementptr [3 x i32], [3 x i32]* %temp_arr19,i32 0, i32 0  ; 获取数组元素指针
    %reg_index19 = load i32, i32* %reg_index_ptr19  ; 加载变量值
    %reg_arr122 = load [3 x i32], [3 x i32]* %main.arr1  ; 加载变量值
    %temp_arr21 = alloca [3 x i32]  ; 分配局部变量
    store [3 x i32] %reg_arr122, [3 x i32]* %temp_arr21  ; 存储值到变量
    %reg_index_ptr21 = getelementptr [3 x i32], [3 x i32]* %temp_arr21,i32 0, i32 1  ; 获取数组元素指针
    %reg_index21 = load i32, i32* %reg_index_ptr21  ; 加载变量值
    %reg_bin18 = add i32 %reg_index19, %reg_index21
    store i32 %reg_bin18, i32* %main.sum_first_two  ; 存储值到变量
    %main.product = alloca i32  ; 分配局部变量
    %reg_arr225 = load [5 x i32], [5 x i32]* %main.arr2  ; 加载变量值
    %temp_arr24 = alloca [5 x i32]  ; 分配局部变量
    store [5 x i32] %reg_arr225, [5 x i32]* %temp_arr24  ; 存储值到变量
    %reg_index_ptr24 = getelementptr [5 x i32], [5 x i32]* %temp_arr24,i32 0, i32 0  ; 获取数组元素指针
    %reg_index24 = load i32, i32* %reg_index_ptr24  ; 加载变量值
    %reg_arr227 = load [5 x i32], [5 x i32]* %main.arr2  ; 加载变量值
    %temp_arr26 = alloca [5 x i32]  ; 分配局部变量
    store [5 x i32] %reg_arr227, [5 x i32]* %temp_arr26  ; 存储值到变量
    %reg_index_ptr26 = getelementptr [5 x i32], [5 x i32]* %temp_arr26,i32 0, i32 1  ; 获取数组元素指针
    %reg_index26 = load i32, i32* %reg_index_ptr26  ; 加载变量值
    %reg_bin23 = mul i32 %reg_index24, %reg_index26
    store i32 %reg_bin23, i32* %main.product  ; 存储值到变量
    %main.index = alloca i32  ; 分配局部变量
    store i32 1, i32* %main.index  ; 存储值到变量
    %main.element_at_index = alloca i32  ; 分配局部变量
    %reg_arr229 = load [5 x i32], [5 x i32]* %main.arr2  ; 加载变量值
    %reg_index30 = load i32, i32* %main.index  ; 加载变量值
    %temp_arr28 = alloca [5 x i32]  ; 分配局部变量
    store [5 x i32] %reg_arr229, [5 x i32]* %temp_arr28  ; 存储值到变量
    %reg_index_ptr28 = getelementptr [5 x i32], [5 x i32]* %temp_arr28,i32 0, i32 %reg_index30  ; 获取数组元素指针
    %reg_index28 = load i32, i32* %reg_index_ptr28  ; 加载变量值
    store i32 %reg_index28, i32* %main.element_at_index  ; 存储值到变量
    %reg_index33 = load i32, i32* %main.index  ; 加载变量值
    %reg_index_ptr31 = getelementptr [5 x i32], [5 x i32]* %main.arr2,i32 0, i32 %reg_index33  ; 获取数组元素指针
    store i32 999, i32* %reg_index_ptr31  ; 存储值到变量
    %main.element_at_expr = alloca i32  ; 分配局部变量
    %reg_arr235 = load [5 x i32], [5 x i32]* %main.arr2  ; 加载变量值
    %reg_bin36 = add i32 2, 1
    %temp_arr34 = alloca [5 x i32]  ; 分配局部变量
    store [5 x i32] %reg_arr235, [5 x i32]* %temp_arr34  ; 存储值到变量
    %reg_index_ptr34 = getelementptr [5 x i32], [5 x i32]* %temp_arr34,i32 0, i32 %reg_bin36  ; 获取数组元素指针
    %reg_index34 = load i32, i32* %reg_index_ptr34  ; 加载变量值
    store i32 %reg_index34, i32* %main.element_at_expr  ; 存储值到变量
    %reg_bin39 = add i32 1, 2
    %reg_index_ptr37 = getelementptr [5 x i32], [5 x i32]* %main.arr2,i32 0, i32 %reg_bin39  ; 获取数组元素指针
    store i32 888, i32* %reg_index_ptr37  ; 存储值到变量
    %main.array_sum = alloca i32  ; 分配局部变量
    %reg_arr143 = load [3 x i32], [3 x i32]* %main.arr1  ; 加载变量值
    %temp_arr42 = alloca [3 x i32]  ; 分配局部变量
    store [3 x i32] %reg_arr143, [3 x i32]* %temp_arr42  ; 存储值到变量
    %reg_index_ptr42 = getelementptr [3 x i32], [3 x i32]* %temp_arr42,i32 0, i32 0  ; 获取数组元素指针
    %reg_index42 = load i32, i32* %reg_index_ptr42  ; 加载变量值
    %reg_arr145 = load [3 x i32], [3 x i32]* %main.arr1  ; 加载变量值
    %temp_arr44 = alloca [3 x i32]  ; 分配局部变量
    store [3 x i32] %reg_arr145, [3 x i32]* %temp_arr44  ; 存储值到变量
    %reg_index_ptr44 = getelementptr [3 x i32], [3 x i32]* %temp_arr44,i32 0, i32 1  ; 获取数组元素指针
    %reg_index44 = load i32, i32* %reg_index_ptr44  ; 加载变量值
    %reg_bin41 = add i32 %reg_index42, %reg_index44
    %reg_arr147 = load [3 x i32], [3 x i32]* %main.arr1  ; 加载变量值
    %temp_arr46 = alloca [3 x i32]  ; 分配局部变量
    store [3 x i32] %reg_arr147, [3 x i32]* %temp_arr46  ; 存储值到变量
    %reg_index_ptr46 = getelementptr [3 x i32], [3 x i32]* %temp_arr46,i32 0, i32 2  ; 获取数组元素指针
    %reg_index46 = load i32, i32* %reg_index_ptr46  ; 加载变量值
    %reg_bin40 = add i32 %reg_bin41, %reg_index46
    store i32 %reg_bin40, i32* %main.array_sum  ; 存储值到变量
    %reg_index_ptr49 = getelementptr [2 x i32], [2 x i32]* %main.arr3,i32 0, i32 0  ; 获取数组元素指针
    %reg_old48 = load i32 , i32* %reg_index_ptr49  ; 加载变量值
    %reg_suffix48 = add i32 %reg_old48, 1
    store i32 %reg_suffix48, i32* %reg_index_ptr49  ; 存储值到变量
    %reg_index_ptr52 = getelementptr [2 x i32], [2 x i32]* %main.arr3,i32 0, i32 1  ; 获取数组元素指针
    %reg_old51 = load i32 , i32* %reg_index_ptr52  ; 加载变量值
    %reg_prefix51 = add i32 %reg_old51, 1
    store i32 %reg_prefix51, i32* %reg_index_ptr52  ; 存储值到变量
    %main.complex_expr = alloca i32  ; 分配局部变量
    %reg_arr157 = load [3 x i32], [3 x i32]* %main.arr1  ; 加载变量值
    %temp_arr56 = alloca [3 x i32]  ; 分配局部变量
    store [3 x i32] %reg_arr157, [3 x i32]* %temp_arr56  ; 存储值到变量
    %reg_index_ptr56 = getelementptr [3 x i32], [3 x i32]* %temp_arr56,i32 0, i32 0  ; 获取数组元素指针
    %reg_index56 = load i32, i32* %reg_index_ptr56  ; 加载变量值
    %reg_arr259 = load [5 x i32], [5 x i32]* %main.arr2  ; 加载变量值
    %temp_arr58 = alloca [5 x i32]  ; 分配局部变量
    store [5 x i32] %reg_arr259, [5 x i32]* %temp_arr58  ; 存储值到变量
    %reg_index_ptr58 = getelementptr [5 x i32], [5 x i32]* %temp_arr58,i32 0, i32 0  ; 获取数组元素指针
    %reg_index58 = load i32, i32* %reg_index_ptr58  ; 加载变量值
    %reg_bin55 = add i32 %reg_index56, %reg_index58
    %reg_arr361 = load [2 x i32], [2 x i32]* %main.arr3  ; 加载变量值
    %temp_arr60 = alloca [2 x i32]  ; 分配局部变量
    store [2 x i32] %reg_arr361, [2 x i32]* %temp_arr60  ; 存储值到变量
    %reg_index_ptr60 = getelementptr [2 x i32], [2 x i32]* %temp_arr60,i32 0, i32 0  ; 获取数组元素指针
    %reg_index60 = load i32, i32* %reg_index_ptr60  ; 加载变量值
    %reg_bin54 = mul i32 %reg_bin55, %reg_index60
    store i32 %reg_bin54, i32* %main.complex_expr  ; 存储值到变量
    %main.is_first_greater = alloca i1  ; 分配局部变量
    %reg_arr164 = load [3 x i32], [3 x i32]* %main.arr1  ; 加载变量值
    %temp_arr63 = alloca [3 x i32]  ; 分配局部变量
    store [3 x i32] %reg_arr164, [3 x i32]* %temp_arr63  ; 存储值到变量
    %reg_index_ptr63 = getelementptr [3 x i32], [3 x i32]* %temp_arr63,i32 0, i32 0  ; 获取数组元素指针
    %reg_index63 = load i32, i32* %reg_index_ptr63  ; 加载变量值
    %reg_arr266 = load [5 x i32], [5 x i32]* %main.arr2  ; 加载变量值
    %temp_arr65 = alloca [5 x i32]  ; 分配局部变量
    store [5 x i32] %reg_arr266, [5 x i32]* %temp_arr65  ; 存储值到变量
    %reg_index_ptr65 = getelementptr [5 x i32], [5 x i32]* %temp_arr65,i32 0, i32 0  ; 获取数组元素指针
    %reg_index65 = load i32, i32* %reg_index_ptr65  ; 加载变量值
    %reg_bin62 = icmp sgt i32 %reg_index63, %reg_index65  ; 比较大于
    store i1 %reg_bin62, i1* %main.is_first_greater  ; 存储值到变量
    %main.is_equal = alloca i1  ; 分配局部变量
    %reg_arr169 = load [3 x i32], [3 x i32]* %main.arr1  ; 加载变量值
    %temp_arr68 = alloca [3 x i32]  ; 分配局部变量
    store [3 x i32] %reg_arr169, [3 x i32]* %temp_arr68  ; 存储值到变量
    %reg_index_ptr68 = getelementptr [3 x i32], [3 x i32]* %temp_arr68,i32 0, i32 1  ; 获取数组元素指针
    %reg_index68 = load i32, i32* %reg_index_ptr68  ; 加载变量值
    %reg_arr271 = load [5 x i32], [5 x i32]* %main.arr2  ; 加载变量值
    %temp_arr70 = alloca [5 x i32]  ; 分配局部变量
    store [5 x i32] %reg_arr271, [5 x i32]* %temp_arr70  ; 存储值到变量
    %reg_index_ptr70 = getelementptr [5 x i32], [5 x i32]* %temp_arr70,i32 0, i32 1  ; 获取数组元素指针
    %reg_index70 = load i32, i32* %reg_index_ptr70  ; 加载变量值
    %reg_bin67 = icmp eq i32 %reg_index68, %reg_index70  ; 比较等于
    store i1 %reg_bin67, i1* %main.is_equal  ; 存储值到变量
    %reg_first_element72 = load i32, i32* %main.first_element  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_first_element72)  ; 函数调用
    %reg_second_element73 = load i32, i32* %main.second_element  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_second_element73)  ; 函数调用
    %reg_third_element74 = load i32, i32* %main.third_element  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_third_element74)  ; 函数调用
    %reg_last_element75 = load i32, i32* %main.last_element  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_last_element75)  ; 函数调用
    %reg_sum_first_two76 = load i32, i32* %main.sum_first_two  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_sum_first_two76)  ; 函数调用
    %reg_product77 = load i32, i32* %main.product  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_product77)  ; 函数调用
    %reg_element_at_index78 = load i32, i32* %main.element_at_index  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_element_at_index78)  ; 函数调用
    %reg_element_at_expr79 = load i32, i32* %main.element_at_expr  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_element_at_expr79)  ; 函数调用
    %reg_array_sum80 = load i32, i32* %main.array_sum  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_array_sum80)  ; 函数调用
    %reg_complex_expr81 = load i32, i32* %main.complex_expr  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_complex_expr81)  ; 函数调用
    %reg_is_first_greater82 = load i1, i1* %main.is_first_greater  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i1 %reg_is_first_greater82)  ; 函数调用
    %reg_is_equal83 = load i1, i1* %main.is_equal  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i1 %reg_is_equal83)  ; 函数调用
    %reg_arr185 = load [3 x i32], [3 x i32]* %main.arr1  ; 加载变量值
    %temp_arr84 = alloca [3 x i32]  ; 分配局部变量
    store [3 x i32] %reg_arr185, [3 x i32]* %temp_arr84  ; 存储值到变量
    %reg_index_ptr84 = getelementptr [3 x i32], [3 x i32]* %temp_arr84,i32 0, i32 0  ; 获取数组元素指针
    %reg_index84 = load i32, i32* %reg_index_ptr84  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_index84)  ; 函数调用
    %reg_arr187 = load [3 x i32], [3 x i32]* %main.arr1  ; 加载变量值
    %temp_arr86 = alloca [3 x i32]  ; 分配局部变量
    store [3 x i32] %reg_arr187, [3 x i32]* %temp_arr86  ; 存储值到变量
    %reg_index_ptr86 = getelementptr [3 x i32], [3 x i32]* %temp_arr86,i32 0, i32 1  ; 获取数组元素指针
    %reg_index86 = load i32, i32* %reg_index_ptr86  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_index86)  ; 函数调用
    %reg_arr189 = load [3 x i32], [3 x i32]* %main.arr1  ; 加载变量值
    %temp_arr88 = alloca [3 x i32]  ; 分配局部变量
    store [3 x i32] %reg_arr189, [3 x i32]* %temp_arr88  ; 存储值到变量
    %reg_index_ptr88 = getelementptr [3 x i32], [3 x i32]* %temp_arr88,i32 0, i32 2  ; 获取数组元素指针
    %reg_index88 = load i32, i32* %reg_index_ptr88  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_index88)  ; 函数调用
    %reg_arr291 = load [5 x i32], [5 x i32]* %main.arr2  ; 加载变量值
    %temp_arr90 = alloca [5 x i32]  ; 分配局部变量
    store [5 x i32] %reg_arr291, [5 x i32]* %temp_arr90  ; 存储值到变量
    %reg_index_ptr90 = getelementptr [5 x i32], [5 x i32]* %temp_arr90,i32 0, i32 1  ; 获取数组元素指针
    %reg_index90 = load i32, i32* %reg_index_ptr90  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_index90)  ; 函数调用
    %reg_arr293 = load [5 x i32], [5 x i32]* %main.arr2  ; 加载变量值
    %temp_arr92 = alloca [5 x i32]  ; 分配局部变量
    store [5 x i32] %reg_arr293, [5 x i32]* %temp_arr92  ; 存储值到变量
    %reg_index_ptr92 = getelementptr [5 x i32], [5 x i32]* %temp_arr92,i32 0, i32 3  ; 获取数组元素指针
    %reg_index92 = load i32, i32* %reg_index_ptr92  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_index92)  ; 函数调用
    %reg_arr395 = load [2 x i32], [2 x i32]* %main.arr3  ; 加载变量值
    %temp_arr94 = alloca [2 x i32]  ; 分配局部变量
    store [2 x i32] %reg_arr395, [2 x i32]* %temp_arr94  ; 存储值到变量
    %reg_index_ptr94 = getelementptr [2 x i32], [2 x i32]* %temp_arr94,i32 0, i32 0  ; 获取数组元素指针
    %reg_index94 = load i32, i32* %reg_index_ptr94  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_index94)  ; 函数调用
    %reg_arr397 = load [2 x i32], [2 x i32]* %main.arr3  ; 加载变量值
    %temp_arr96 = alloca [2 x i32]  ; 分配局部变量
    store [2 x i32] %reg_arr397, [2 x i32]* %temp_arr96  ; 存储值到变量
    %reg_index_ptr96 = getelementptr [2 x i32], [2 x i32]* %temp_arr96,i32 0, i32 1  ; 获取数组元素指针
    %reg_index96 = load i32, i32* %reg_index_ptr96  ; 加载变量值
    call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @format, i32 0, i32 0), i32 %reg_index96)  ; 函数调用
    ret i32 0  ; 返回
    }