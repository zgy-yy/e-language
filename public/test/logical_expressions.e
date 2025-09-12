// 逻辑表达式测试用例
// 包括比较运算、逻辑运算等

int main() {
    int a = 10;
    int b = 20;
    int c = 10;
    bool flag1 = true;
    bool flag2 = false;
    
    // 比较运算测试
    bool equal_test = a == c;        // true
    bool not_equal_test = a != b;    // true
    bool greater_test = b > a;       // true
    bool less_test = a < b;          // true
    bool greater_equal_test = a >= c; // true
    bool less_equal_test = a <= b;   // true
    
    // 逻辑运算测试
    bool and_test = flag1 && flag2;  // false
    bool or_test = flag1 || flag2;   // true
    bool not_test = !flag1;          // false
    
    // 复杂逻辑表达式测试
    bool complex_and = (a == c) && (b > a);
    bool complex_or = (a != b) || (c == a);
    bool nested_logic = ((a < b) && (b > c)) || (a == c);
    
    // 混合算术和逻辑运算
    bool arithmetic_logic = (a + b) > (c * 2);
    bool complex_mixed = ((a + c) == b) && (flag1 || flag2);
    
    // 逻辑运算优先级测试
    bool precedence_test1 = a < b && c == a || flag1;
    bool precedence_test2 = !flag1 && flag2 || a != b;
    
    // 打印测试结果
    print equal_test;
    print not_equal_test;
    print greater_test;
    print less_test;
    print greater_equal_test;
    print less_equal_test;
    print and_test;
    print or_test;
    print not_test;
    print complex_and;
    print complex_or;
    print nested_logic;
    print arithmetic_logic;
    print complex_mixed;
    print precedence_test1;
    print precedence_test2;
    
    return 0;
}
