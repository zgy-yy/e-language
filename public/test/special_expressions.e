// 特殊表达式测试用例
// 包括逗号表达式、初始化表达式、分组表达式等

int main() {
    int a = 10;
    int b = 20;
    int c = 30;
    
    // 逗号表达式测试
    int comma_result1 = (a++, b++, c++);  // 逗号表达式的值为最后一个表达式的值
    print comma_result1;  // 应该打印30（c的原始值）
    print a;  // 应该打印11
    print b;  // 应该打印21
    print c;  // 应该打印31
    
    int comma_result2 = (a = 100, b = 200, c = 300);
    print comma_result2;  // 应该打印300
    print a;  // 应该打印100
    print b;  // 应该打印200
    print c;  // 应该打印300
    
    // 复杂逗号表达式
    int complex_comma = (a += 10, b *= 2, c -= 50, a + b + c);
    print complex_comma;  // 应该打印 110 + 400 + 250 = 760
    print a;  // 应该打印110
    print b;  // 应该打印400
    print c;  // 应该打印250
    
    // 分组表达式测试
    int grouping_result1 = (a + b) * (c - a);
    print grouping_result1;  // 应该打印 (110 + 400) * (250 - 110) = 510 * 140 = 71400
    
    int grouping_result2 = ((a + b) + c) * 2;
    print grouping_result2;  // 应该打印 (510 + 250) * 2 = 1520
    
    // 复杂分组表达式
    int complex_grouping = ((a * 2) + (b / 2)) - ((c + 10) / 3);
    print complex_grouping;  // 应该打印 (220 + 200) - (260/3) = 420 - 86 = 334
    
    // 初始化表达式测试
    int init_var1 = 42;
    int init_var2 = init_var1 * 2;
    bool init_bool = true;
    
    // 复杂初始化
    int complex_init = (init_var1 + init_var2) * 3;
    print complex_init;  // 应该打印 (42 + 84) * 3 = 378
    
    // 条件表达式在初始化中的使用
    int conditional_init = (init_var1 > 40) ? init_var1 : init_var2;
    print conditional_init;  // 应该打印42
    
    // 嵌套分组表达式
    int nested_grouping = (((a + 1) * 2) + ((b - 1) / 2)) * ((c + 1) / 2);
    print nested_grouping;  // 应该打印 ((111*2) + (399/2)) * (251/2) = (222 + 199) * 125 = 52625
    
    // 逗号表达式在条件中的使用
    bool comma_condition = (a = 1, b = 2, c = 3, a + b + c > 5);
    print comma_condition;  // 应该为true
    print a;  // 应该打印1
    print b;  // 应该打印2
    print c;  // 应该打印3
    
    // 逗号表达式在循环中的使用
    for (int i = 0, j = 10; i < 3; i++, j--) {
        print i * 1000 + j;  // 应该打印 10010, 10019, 10028
    }
    
    // 复杂逗号表达式链
    int chain_comma = (a++, b++, c++, a = a + b, b = b + c, c = c + a, a + b + c);
    print chain_comma;  // 复杂计算结果
    print a;  // 最终a值
    print b;  // 最终b值
    print c;  // 最终c值
    
    // 分组表达式与逻辑运算的结合
    bool logic_grouping = ((a > 0) && (b > 0)) || ((c > 0) && (a + b > c));
    print logic_grouping;  // 应该为true
    
    // 逗号表达式与赋值结合
    int assign_comma = (a = 100, b = 200, c = 300, a + b + c);
    print assign_comma;  // 应该打印600
    
    // 复杂嵌套表达式
    int super_complex = ((a + b) * (c - a)) + ((b + c) / (a + 1)) - ((c - a) * (b - a));
    print super_complex;  // 复杂计算结果
    
    return 0;
}
