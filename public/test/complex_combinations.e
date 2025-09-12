// 复杂组合测试用例
// 包括嵌套表达式、复杂语句、多种语法特性的组合使用

struct Point {
    int x;
    int y;
}

struct Rectangle {
    Point top_left;
    Point bottom_right;
}

// 复杂函数定义
int calculate_area(Rectangle rect) {
    int width = rect.bottom_right.x - rect.top_left.x;
    int height = rect.bottom_right.y - rect.top_left.y;
    return width * height;
}

// 高阶函数
int apply_to_array([3]int arr, (int)int func) {
    int sum = 0;
    for (int i = 0; i < 3; i++) {
        sum += func(arr[i]);
    }
    return sum;
}

int square(int x) {
    return x * x;
}

int main() {
    // 复杂结构体初始化
    Rectangle rect = {
        top_left: {
            x: 10,
            y: 20
        },
        bottom_right: {
            x: 50,
            y: 60
        }
    };
    
    // 复杂数组初始化
    [3]int numbers = [1, 2, 3];
    [2]Rectangle rects = [
        {
            top_left: {x: 0, y: 0},
            bottom_right: {x: 10, y: 10}
        },
        {
            top_left: {x: 5, y: 5},
            bottom_right: {x: 15, y: 15}
        }
    ];
    
    // 复杂指针操作
    int@ ptr => numbers[0];
    Rectangle@ rect_ptr => rect;
    
    // 复杂表达式组合
    int complex_calc = calculate_area(rect) + (ptr => 0) * 2;
    print complex_calc;  // 应该打印 40*40 + 1*2 = 1602
    
    // 嵌套函数调用
    int nested_result = apply_to_array(numbers, square);
    print nested_result;  // 应该打印 1*1 + 2*2 + 3*3 = 14
    
    // 复杂条件表达式
    bool complex_condition = (rect.top_left.x < rect.bottom_right.x) && 
                            (rect.top_left.y < rect.bottom_right.y) &&
                            (numbers[0] > 0);
    print complex_condition;  // 应该为true
    
    // 复杂循环结构
    int sum = 0;
    for (int i = 0; i < 2; i++) {
        Rectangle current_rect = rects[i];
        int area = calculate_area(current_rect);
        sum += area;
        
        // 嵌套循环
        for (int j = 0; j < 3; j++) {
            if (numbers[j] > 1) {
                sum += numbers[j] * area;
            }
        }
    }
    print sum;  // 复杂计算结果
    
    // 复杂指针操作
    rect_ptr => top_left => x = 5;
    rect_ptr => top_left => y = 15;
    rect_ptr => bottom_right => x = 45;
    rect_ptr => bottom_right => y = 55;
    
    int new_area = calculate_area(rect);
    print new_area;  // 应该打印 40*40 = 1600
    
    // 复杂闭包
    int multiplier = 3;
    (int,int)int complex_closure = (int a, int b)int {
        return (a + b) * multiplier;
    };
    
    int closure_result = complex_closure(10, 20);
    print closure_result;  // 应该打印 (10+20)*3 = 90
    
    // 复杂赋值链
    int a, b, c;
    a = b = c = 100;
    int chain_result = a + b + c;
    print chain_result;  // 应该打印 300
    
    // 复杂数组操作
    numbers[0] = (numbers[1] + numbers[2]) * 2;
    numbers[1] = numbers[0] / 2;
    numbers[2] = numbers[0] - numbers[1];
    
    print numbers[0];  // 应该打印 (2+3)*2 = 10
    print numbers[1];  // 应该打印 10/2 = 5
    print numbers[2];  // 应该打印 10-5 = 5
    
    // 复杂条件语句
    if (calculate_area(rect) > 1000) {
        if (numbers[0] > 5) {
            print 1000;  // 应该执行
        } else {
            print 2000;  // 不应该执行
        }
    } else {
        print 3000;  // 不应该执行
    }
    
    // 复杂while循环
    int counter = 0;
    int total = 0;
    while (counter < 3) {
        Rectangle current = rects[counter % 2];
        int area = calculate_area(current);
        total += area;
        
        // 复杂条件判断
        if (total > 2000) {
            break;
        }
        
        counter++;
    }
    print total;  // 复杂循环结果
    
    // 复杂表达式优先级测试
    int precedence_test = (a + b) * c - (a / b) + (a % b);
    print precedence_test;  // 应该打印 (100+100)*100 - (100/100) + (100%100) = 19999
    
    // 复杂一元表达式
    int unary_test = -++a + +--b - !false;
    print unary_test;  // 复杂一元运算结果
    
    // 复杂逻辑表达式
    bool logic_test = (a > 50) && (b < 150) || (c == 100) && !false;
    print logic_test;  // 应该为true
    
    // 复杂函数类型
    (int,int)int add_func = (int x, int y)int { return x + y; };
    (int,int)int mul_func = (int x, int y)int { return x * y; };
    
    int func_result = add_func(mul_func(2, 3), add_func(4, 5));
    print func_result;  // 应该打印 add(mul(2,3), add(4,5)) = add(6, 9) = 15
    
    return 0;
}
