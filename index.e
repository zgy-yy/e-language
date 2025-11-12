link "/index.e"

+ - * /   数学运算 
& | ~  ^ 位运算
<< >>    移位
! && ||  逻辑运算
% 取模 
?: 条件运算
@ 地址分配运算符
i++ --i //自增自减

> < != == >= <=



Int cc = 21;
Int ptr = 0x99199233;
const Int b = 90;

//Int a @ 0x808929;

Int@ pi => cc;
pi=23;
pi => b;




//全局变量
Int age = 99;
String str = "hello world";
[]Int arr =[1,2,3,4,5] //数组
arr[1];
[int,string] tup =[1,"hello]; //元组
tup[0]
tup[1]


Int a =23;
//指针类型
Int@ ptr  => a;
ptr = 23; 



函数类型

(int ,int)string cc=(a,b){
    return "232";
}


//函数
fpt()  {
    static Int a=90;
    return ""
}

//参数
int func(int a,string b,int c=0,int d=4){

}
func(1,"ddda",d=4)

int foo(int a=1, b=1, c=4,bool d)


//结构体
struct Base{
     Int a;
}

struct BA{
    string b;
}
struct BB{
    string b;
}
 

C c={
    Ba : 90,
    c : 90
}


type Stu =  class {
    Int num1;
    Int n2;
}

type Tea = struct{
    string name;
}



class A{
    static Int cc = 90
    Uint a =0;

    public
   say(){
     A.c=23;

   }

}


class A{
    int age;
}
class B::A{
    int age;
}

class C{
    int age;
    void say(){
        a=1
    }
}



void main(){

    B b = B();
    AA m = {
        nm : 90,
    }
    AA n ;
    n.nm =90, 
      .cc =23;

   label C {
        print("helloc")
    }
    goto C

    if(){

    }else if{

    }else{

    }

    switch(a ){
        case a==12:
            break;
        case a>12:
            break;
    }

    Int print(){
        B b = new B("ell")
        main..b.name = b

        retrun {
            a:3
            d:"hello"
        }
    }

}

class P{
    static string name;
    Int age;
}

clsss M{
    Int age;
    void() say;
}


int process(){

    sleep(12);
    retrun 1;
}
int mian(){
    Thread t= run process();
    print(1);
   int c= await t;
   print c;

}




//静态多态， 
// 函数静态多态 static 编译时确定
// 动态多态，虚函数表，运行时计算偏移