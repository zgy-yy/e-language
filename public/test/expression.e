
//全局变量
int a = 23;

//全局函数类型变量
(int)void fo=(int i)void{

};

struct STU{
    int age;
    bool sex;
}

int fun(int a){
    return 123;
}

//函数
int main(){

    //函数调用
    fo(1);

    fun(1);

    STU s={
        age:19,
        sex:false,
    };
    s.age=23;

    //数组类型
    [3]int arr = [1,2,3];

    //局部变量
    int a=1;

    //指针 指向a变量
    int@ ptr =>a;
    


    //分支语句
    if(a>23){
        print 23;
    }else
        print 12;

    //for循环
    for(int i=3;i<24;i++){

    }
    //do while循环
    do{
        a=1;//
    }while(a>34);

    
    

    return 12;
}