// 变量声明和类型测试用例
// 包括各种变量声明方式、类型声明等

// 全局变量声明
int global_int = 42;
bool global_bool = true;
int global_uninitialized;

// 全局函数类型变量
(int)int global_func = (int x)int { return x * 2; };

// 全局结构体
struct GlobalStruct {
    int value;
    bool flag;
}

// 全局结构体变量
GlobalStruct global_struct = {
    value: 100,
    flag: false
};

// 全局数组
[3]int global_array = [1, 2, 3];

int main() {
    // 基础类型变量声明
    int local_int = 10;
    bool local_bool = false;
    int uninitialized_int;
    
    // 变量列表声明
    int a, b, c;
    bool flag1, flag2;
    
    // 初始化变量列表
    a = 1;
    b = 2;
    c = 3;
    flag1 = true;
    flag2 = false;
    
    // 函数类型变量声明
    (int,int)int add_func = (int x, int y)int { return x + y; };
    (int)int square_func = (int x)int { return x * x; };
    ()void void_func = ()void { print 999; };
    
    // 复杂函数类型
    ((int)int)int higher_order = ((int)int f)int { return f(10); };
    
    // 数组类型声明
    [5]int int_array = [10, 20, 30, 40, 50];
    [2]bool bool_array = [true, false];
    [3]int uninitialized_array;
    
    // 结构体类型声明
    struct LocalStruct {
        int number;
        bool status;
        [2]int values;
    }
    
    LocalStruct local_struct = {
        number: 42,
        status: true,
        values: [1, 2]
    };
    
    // 指针类型声明
    int@ int_ptr => local_int;
    bool@ bool_ptr => local_bool;
    LocalStruct@ struct_ptr => local_struct;
    [5]int@ array_ptr => int_array;
    
    // 复杂指针类型
    int@@ double_ptr => int_ptr;
    
    // 函数类型指针
    (int,int)int@ func_ptr => add_func;
    
    // 变量重新赋值测试
    local_int = 100;
    local_bool = true;
    uninitialized_int = 200;
    
    // 数组元素赋值
    int_array[0] = 1000;
    int_array[1] = 2000;
    bool_array[0] = false;
    bool_array[1] = true;
    
    // 结构体字段赋值
    local_struct.number = 999;
    local_struct.status = false;
    local_struct.values[0] = 10;
    local_struct.values[1] = 20;
    
    // 通过指针修改值
    int_ptr => 500;
    bool_ptr => false;
    struct_ptr => number = 888;
    array_ptr => 0 = 777;
    
    // 函数调用测试
    int func_result1 = add_func(10, 20);
    int func_result2 = square_func(5);
    int higher_result = higher_order(square_func);
    
    // 通过函数指针调用
    int ptr_func_result = func_ptr => (15, 25);
    
    // 复杂类型组合
    struct ComplexStruct {
        int@ ptr;
        (int)int func;
        [2]int array;
    }
    
    ComplexStruct complex = {
        ptr: int_ptr,
        func: square_func,
        array: [100, 200]
    };
    
    // 访问复杂结构体
    int complex_ptr_val = complex.ptr => 0;
    int complex_func_val = complex.func(3);
    int complex_array_val = complex.array[0];
    
    // 打印测试结果
    print global_int;
    print global_bool;
    print local_int;
    print local_bool;
    print uninitialized_int;
    print a;
    print b;
    print c;
    print flag1;
    print flag2;
    print func_result1;
    print func_result2;
    print higher_result;
    print ptr_func_result;
    print int_array[0];
    print int_array[1];
    print bool_array[0];
    print bool_array[1];
    print local_struct.number;
    print local_struct.status;
    print local_struct.values[0];
    print local_struct.values[1];
    print complex_ptr_val;
    print complex_func_val;
    print complex_array_val;
    
    return 0;
}
