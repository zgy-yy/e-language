// 函数表达式测试用例
// 包括函数调用、函数类型、闭包等

// 全局函数定义
int add(int a, int b) {
    return a + b;
}

int multiply(int x, int y) {
    return x * y;
}

void print_number(int n) {
    print n;
}

// 高阶函数
int apply_operation(int a, int b, (int,int)int op) {
    return op(a, b);
}

int main() {
    // 基础函数调用测试
    int result1 = add(10, 20);        // 30
    int result2 = multiply(5, 6);     // 30
    int result3 = add(add(1, 2), 3);  // 6
    
    // 函数类型变量测试
    (int,int)int func_var = add;
    int result4 = func_var(15, 25);   // 40
    
    // 函数类型变量重新赋值
    func_var = multiply;
    int result5 = func_var(4, 7);     // 28
    
    // 高阶函数调用测试
    int result6 = apply_operation(8, 9, add);      // 17
    int result7 = apply_operation(8, 9, multiply); // 72
    
    // 闭包测试
    int counter = 0;
    ()void increment = ()void {
        counter++;
    };
    
    // 调用闭包
    increment();
    increment();
    increment();
    
    // 带参数的闭包
    int multiplier = 3;
    (int)int multiply_by = (int x)int {
        return x * multiplier;
    };
    
    int result8 = multiply_by(10);  // 30
    
    // 嵌套函数调用测试
    int result9 = add(multiply(2, 3), add(4, 5));  // 6 + 9 = 15
    
    // 函数调用作为参数
    int result10 = apply_operation(add(1, 2), multiply(3, 4), add);  // 3 + 12 = 15
    
    // 打印测试结果
    print result1;
    print result2;
    print result3;
    print result4;
    print result5;
    print result6;
    print result7;
    print counter;  // 应该为3
    print result8;
    print result9;
    print result10;
    
    return 0;
}
