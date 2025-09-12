// 一元表达式测试用例
// 包括自增自减、取反等

int main() {
    int a = 5;
    int b = 10;
    bool flag = true;
    
    // 前缀自增自减测试
    int prefix_inc = ++a;    // a变成6，prefix_inc为6
    int prefix_dec = --b;    // b变成9，prefix_dec为9
    
    // 后缀自增自减测试
    int postfix_inc = a++;   // postfix_inc为6，a变成7
    int postfix_dec = b--;   // postfix_dec为9，b变成8
    
    // 一元取反测试
    bool not_flag = !flag;   // false
    bool not_false = !false; // true
    
    // 一元正负号测试
    int positive = +a;       // 7
    int negative = -a;       // -7
    int double_negative = -(-a); // 7
    
    // 复杂一元表达式测试
    int complex_unary = -++a;     // -(++a)，a变成8，结果为-8
    bool complex_not = !(a > 5);  // !(8 > 5) = false
    
    // 一元表达式在算术运算中的使用
    int arithmetic_with_unary = ++a + --b;  // 9 + 7 = 16
    int mixed_unary = -a + +b;              // -9 + 7 = -2
    
    // 打印测试结果
    print prefix_inc;
    print prefix_dec;
    print postfix_inc;
    print postfix_dec;
    print not_flag;
    print not_false;
    print positive;
    print negative;
    print double_negative;
    print complex_unary;
    print complex_not;
    print arithmetic_with_unary;
    print mixed_unary;
    
    // 打印最终变量值
    print a;  // 应该为9
    print b;  // 应该为7
    
    return 0;
}
