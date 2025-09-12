// 赋值表达式测试用例
// 包括各种赋值操作符

int main() {
    int a = 10;
    int b = 5;
    int c = 3;
    
    // 基础赋值测试
    int simple_assign = a = 20;  // a变成20，simple_assign为20
    
    // 复合赋值操作符测试
    int plus_assign = a += 5;    // a变成25，plus_assign为25
    int minus_assign = a -= 3;   // a变成22，minus_assign为22
    int star_assign = a *= 2;    // a变成44，star_assign为44
    int slash_assign = a /= 4;   // a变成11，slash_assign为11
    
    // 链式赋值测试
    int chain_assign = a = b = c = 100;  // 所有变量都变成100
    
    // 赋值表达式在条件中的使用
    bool assign_in_condition = (a = 50) > 40;  // a变成50，条件为true
    
    // 复杂赋值表达式测试
    int complex_assign = a = (b + c) * 2;  // a = (100 + 100) * 2 = 400
    
    // 自增自减与赋值的结合
    int inc_assign = a = ++b;    // b变成101，a变成101
    int dec_assign = a = b--;    // a变成101，b变成100
    
    // 打印测试结果
    print simple_assign;
    print plus_assign;
    print minus_assign;
    print star_assign;
    print slash_assign;
    print chain_assign;
    print assign_in_condition;
    print complex_assign;
    print inc_assign;
    print dec_assign;
    
    // 打印最终变量值
    print a;  // 应该为101
    print b;  // 应该为100
    print c;  // 应该为100
    
    return 0;
}
