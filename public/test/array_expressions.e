// 数组表达式测试用例
// 包括数组创建、索引访问、数组赋值等

int main() {
    // 数组创建测试
    [3]int arr1 = [1, 2, 3];
    [5]int arr2 = [10, 20, 30, 40, 50];
    [2]int arr3 = [100, 200];
    
    // 空数组测试
    [0]int empty_arr = [];
    
    // 数组索引访问测试
    int first_element = arr1[0];    // 1
    int second_element = arr1[1];   // 2
    int third_element = arr1[2];    // 3
    int last_element = arr2[4];     // 50
    
    // 数组元素赋值测试
    arr1[0] = 100;
    arr1[1] = 200;
    arr1[2] = 300;
    
    // 数组元素参与运算
    int sum_first_two = arr1[0] + arr1[1];  // 100 + 200 = 300
    int product = arr2[0] * arr2[1];        // 10 * 20 = 200
    
    // 数组索引使用变量
    int index = 1;
    int element_at_index = arr2[index];     // 20
    arr2[index] = 999;                      // arr2[1] = 999
    
    // 数组索引使用表达式
    int element_at_expr = arr2[2 + 1];      // arr2[3] = 40
    arr2[1 + 2] = 888;                      // arr2[3] = 888
    
    // 数组作为函数参数（通过索引）
    int array_sum = arr1[0] + arr1[1] + arr1[2];  // 100 + 200 + 300 = 600
    
    // 数组元素的自增自减
    arr3[0]++;                              // arr3[0] = 101
    ++arr3[1];                              // arr3[1] = 201
    
    // 复杂数组表达式
    int complex_expr = (arr1[0] + arr2[0]) * arr3[0];  // (100 + 10) * 101 = 11110
    
    // 数组元素的条件判断
    bool is_first_greater = arr1[0] > arr2[0];  // 100 > 10 = true
    bool is_equal = arr1[1] == arr2[1];         // 200 == 999 = false
    
    // 打印测试结果
    print first_element;
    print second_element;
    print third_element;
    print last_element;
    print sum_first_two;
    print product;
    print element_at_index;
    print element_at_expr;
    print array_sum;
    print complex_expr;
    print is_first_greater;
    print is_equal;
    
    // 打印修改后的数组元素
    print arr1[0];  // 100
    print arr1[1];  // 200
    print arr1[2];  // 300
    print arr2[1];  // 999
    print arr2[3];  // 888
    print arr3[0];  // 101
    print arr3[1];  // 201
    
    return 0;
}
