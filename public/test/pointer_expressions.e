// 指针表达式测试用例
// 包括指针声明、箭头操作等

struct Point {
    int x;
    int y;
}

int main() {
    // 基础变量
    int a = 10;
    int b = 20;
    bool flag = true;
    
    // 指针声明和初始化测试
    int@ ptr1 => a;        // 指向变量a
    int@ ptr2 => b;        // 指向变量b
    bool@ ptr3 => flag;    // 指向变量flag
    
    // 指针解引用测试（通过箭头操作符）
    int value1 = ptr1 => 0;    // 获取ptr1指向的值，应该为10
    int value2 = ptr2 => 0;    // 获取ptr2指向的值，应该为20
    bool value3 = ptr3 => 0;   // 获取ptr3指向的值，应该为true
    
    // 通过指针修改值
    ptr1 => 100;               // 修改a的值为100
    ptr2 => 200;               // 修改b的值为200
    ptr3 => false;             // 修改flag的值为false
    
    // 验证修改结果
    int new_value1 = ptr1 => 0;    // 应该为100
    int new_value2 = ptr2 => 0;    // 应该为200
    bool new_value3 = ptr3 => 0;   // 应该为false
    
    // 指针参与算术运算
    int sum = (ptr1 => 0) + (ptr2 => 0);  // 100 + 200 = 300
    int diff = (ptr2 => 0) - (ptr1 => 0); // 200 - 100 = 100
    
    // 指针的条件判断
    bool is_greater = (ptr2 => 0) > (ptr1 => 0);  // 200 > 100 = true
    bool is_equal = (ptr1 => 0) == 100;           // 100 == 100 = true
    
    // 结构体指针测试
    Point pt = {
        x: 5,
        y: 10
    };
    
    Point@ ptr4 => pt;         // 指向结构体pt
    
    // 通过指针访问结构体字段
    int pt_x = ptr4 => x;      // 应该为5
    int pt_y = ptr4 => y;      // 应该为10
    
    // 通过指针修改结构体字段
    ptr4 => x = 15;            // 修改pt.x为15
    ptr4 => y = 25;            // 修改pt.y为25
    
    // 验证结构体修改结果
    int new_pt_x = ptr4 => x;  // 应该为15
    int new_pt_y = ptr4 => y;  // 应该为25
    
    // 数组指针测试
    [3]int arr = [1, 2, 3];
    [3]int@ ptr5 => arr;       // 指向数组arr
    
    // 通过指针访问数组元素
    int arr_elem = ptr5 => 0;  // 应该为1
    
    // 通过指针修改数组元素
    ptr5 => 0 = 100;           // 修改arr[0]为100
    
    // 验证数组修改结果
    int new_arr_elem = ptr5 => 0;  // 应该为100
    
    // 指针的指针测试
    int@ ptr6 => a;            // 指向a
    int@@ ptr7 => ptr6;        // 指向ptr6
    
    // 通过双重指针访问值
    int double_deref = ptr7 => 0 => 0;  // 应该为100
    
    // 复杂指针表达式
    int complex_expr = (ptr1 => 0) * (ptr2 => 0) + (ptr4 => x);  // 100 * 200 + 15 = 20015
    
    // 打印测试结果
    print value1;      // 10
    print value2;      // 20
    print value3;      // true
    print new_value1;  // 100
    print new_value2;  // 200
    print new_value3;  // false
    print sum;         // 300
    print diff;        // 100
    print is_greater;  // true
    print is_equal;    // true
    print pt_x;        // 5
    print pt_y;        // 10
    print new_pt_x;    // 15
    print new_pt_y;    // 25
    print arr_elem;    // 1
    print new_arr_elem; // 100
    print double_deref; // 100
    print complex_expr; // 20015
    
    // 打印原始变量值验证
    print a;           // 100
    print b;           // 200
    print flag;        // false
    print pt.x;        // 15
    print pt.y;        // 25
    print arr[0];      // 100
    
    return 0;
}
