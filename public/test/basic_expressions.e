// 基础表达式测试用例
// 包括字面量、变量、算术运算等

// 全局变量声明
int global_var = 42;
bool global_bool = true;

int main() {
    // 字面量表达式测试
    int num_literal = 123;
    bool bool_literal = false;
    int zero = 0;
    int negative = -456;
    
    // 变量表达式测试
    int local_var = global_var;
    bool local_bool = global_bool;
    
    // 基础算术运算测试
    int sum = 10 + 20;
    int diff = 50 - 30;
    int product = 6 * 7;
    int quotient = 100 / 4;
    
    // 复杂算术表达式测试
    int complex_expr = (10 + 5) * 3 - 2;
    int nested_parens = ((2 + 3) * (4 - 1)) / 3;
    
    // 变量参与的算术运算
    int var_arithmetic = global_var + local_var;
    int mixed_expr = (global_var * 2) + (local_var - 10);
    
    // 打印测试结果
    print sum;
    print diff;
    print product;
    print quotient;
    print complex_expr;
    print nested_parens;
    print var_arithmetic;
    print mixed_expr;
    
    return 0;
}
