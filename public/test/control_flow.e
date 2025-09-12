// 控制流语句测试用例
// 包括if、while、for、do-while、loop、break、continue等

int main() {
    int counter = 0;
    int sum = 0;
    int i = 0;
    
    // if语句测试
    int a = 10;
    int b = 20;
    
    if (a < b) {
        print 1;  // 应该执行
    }
    
    if (a > b) {
        print 2;  // 不应该执行
    } else {
        print 3;  // 应该执行
    }
    
    // 嵌套if语句测试
    if (a < 15) {
        if (b > 15) {
            print 4;  // 应该执行
        }
    }
    
    // while循环测试
    int while_counter = 0;
    while (while_counter < 3) {
        print 100 + while_counter;  // 应该打印100, 101, 102
        while_counter++;
    }
    
    // for循环测试
    for (int j = 0; j < 3; j++) {
        print 200 + j;  // 应该打印200, 201, 202
    }
    
    // do-while循环测试
    int do_counter = 0;
    do {
        print 300 + do_counter;  // 应该打印300, 301, 302
        do_counter++;
    } while (do_counter < 3);
    
    // loop循环测试（无条件循环，需要break退出）
    int loop_counter = 0;
    loop {
        print 400 + loop_counter;  // 应该打印400, 401, 402
        loop_counter++;
        if (loop_counter >= 3) {
            break;  // 退出循环
        }
    }
    
    // break语句测试
    for (int k = 0; k < 5; k++) {
        if (k == 2) {
            break;  // 在k=2时退出循环
        }
        print 500 + k;  // 应该打印500, 501
    }
    
    // continue语句测试
    for (int l = 0; l < 4; l++) {
        if (l == 1) {
            continue;  // 跳过l=1的迭代
        }
        print 600 + l;  // 应该打印600, 602, 603
    }
    
    // 嵌套循环测试
    for (int m = 0; m < 2; m++) {
        for (int n = 0; n < 2; n++) {
            print 700 + m * 10 + n;  // 应该打印700, 701, 710, 711
        }
    }
    
    // 复杂条件测试
    int x = 5;
    int y = 10;
    
    if (x > 0 && y > 0) {
        print 800;  // 应该执行
    }
    
    if (x > 10 || y > 5) {
        print 801;  // 应该执行
    }
    
    // 循环中的条件判断
    for (int p = 0; p < 5; p++) {
        if (p % 2 == 0) {
            print 900 + p;  // 应该打印900, 902, 904
        }
    }
    
    // while循环中的break和continue
    int q = 0;
    while (q < 5) {
        if (q == 1) {
            q++;
            continue;  // 跳过q=1
        }
        if (q == 3) {
            break;  // 在q=3时退出
        }
        print 1000 + q;  // 应该打印1000, 1002
        q++;
    }
    
    // 空循环体测试
    for (int r = 0; r < 3; r++) {
        // 空循环体
    }
    print 1100;  // 应该执行
    
    // 单语句循环体测试
    for (int s = 0; s < 2; s++)
        print 1200 + s;  // 应该打印1200, 1201
    
    return 0;
}
