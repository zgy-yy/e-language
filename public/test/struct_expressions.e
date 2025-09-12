// 结构体表达式测试用例
// 包括结构体创建、字段访问、字段赋值等

// 结构体定义
struct Person {
    int age;
    bool is_student;
}

struct Point {
    int x;
    int y;
}

struct Rectangle {
    Point top_left;
    Point bottom_right;
}

int main() {
    // 结构体创建测试
    Person p1 = {
        age: 25,
        is_student: true
    };
    
    Person p2 = {
        age: 30,
        is_student: false
    };
    
    Point pt1 = {
        x: 10,
        y: 20
    };
    
    Point pt2 = {
        x: 50,
        y: 60
    };
    
    // 嵌套结构体创建
    Rectangle rect = {
        top_left: pt1,
        bottom_right: pt2
    };
    
    // 结构体字段访问测试
    int person_age = p1.age;           // 25
    bool student_status = p1.is_student; // true
    int point_x = pt1.x;               // 10
    int point_y = pt1.y;               // 20
    
    // 嵌套字段访问
    int rect_x1 = rect.top_left.x;     // 10
    int rect_y1 = rect.top_left.y;     // 20
    int rect_x2 = rect.bottom_right.x; // 50
    int rect_y2 = rect.bottom_right.y; // 60
    
    // 结构体字段赋值测试
    p1.age = 26;
    p1.is_student = false;
    pt1.x = 15;
    pt1.y = 25;
    
    // 嵌套字段赋值
    rect.top_left.x = 5;
    rect.top_left.y = 10;
    rect.bottom_right.x = 55;
    rect.bottom_right.y = 65;
    
    // 结构体字段参与运算
    int age_difference = p2.age - p1.age;  // 30 - 26 = 4
    int point_distance = pt2.x - pt1.x;    // 50 - 15 = 35
    int rect_width = rect.bottom_right.x - rect.top_left.x;  // 55 - 5 = 50
    int rect_height = rect.bottom_right.y - rect.top_left.y; // 65 - 10 = 55
    
    // 结构体字段的条件判断
    bool is_older = p2.age > p1.age;       // 30 > 26 = true
    bool is_student = p1.is_student;       // false
    bool points_equal = pt1.x == pt2.x;    // 15 == 50 = false
    
    // 结构体字段的自增自减
    p1.age++;                              // p1.age = 27
    ++pt1.x;                               // pt1.x = 16
    rect.top_left.y--;                     // rect.top_left.y = 9
    
    // 复杂结构体表达式
    int complex_expr = (p1.age + pt1.x) * rect_width;  // (27 + 16) * 50 = 2150
    
    // 匿名结构体测试
    struct {
        int value;
        bool flag;
    } anonymous = {
        value: 42,
        flag: true
    };
    
    int anon_value = anonymous.value;      // 42
    bool anon_flag = anonymous.flag;       // true
    anonymous.value = 100;
    anonymous.flag = false;
    
    // 打印测试结果
    print person_age;
    print student_status;
    print point_x;
    print point_y;
    print rect_x1;
    print rect_y1;
    print rect_x2;
    print rect_y2;
    print age_difference;
    print point_distance;
    print rect_width;
    print rect_height;
    print is_older;
    print is_student;
    print points_equal;
    print complex_expr;
    print anon_value;
    print anon_flag;
    
    // 打印修改后的值
    print p1.age;        // 27
    print p1.is_student; // false
    print pt1.x;         // 16
    print pt1.y;         // 25
    print rect.top_left.x;  // 5
    print rect.top_left.y;  // 9
    print anonymous.value;  // 100
    print anonymous.flag;   // false
    
    return 0;
}
