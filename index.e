link "/index.x"

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

Int@ pC => cc;
pC=23;
pC => b;




//全局变量
Int age = 99;
String str = "hello world";
[]Int arr =[1,2,3,4,5] //数组
arr[1];
[int,string] tup =[1,"hello]; //元组
tup[0]
tup[1]


函数类型

//函数类型
string(Int,string)  funcPlay = (a,b){

    return "hello"
}

void() say=(){
    print("hello")
}

Int(Int,Int) count=(a,b){
    retrun a+b;
}

//函数
string pt(){
    static Int a=90;
    return ""
}

//参数
int func(int a,string b,int c=0,int d=4){

}
func(1,"ddda",d=4)


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
 
struct C::BA,BB{
    BB..b=32;

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
    void() say；
}



class A{
    static Int cc = 90
    Uint a =0;

    public

}
class B <: A,C{
    Int cc =90
    Uint a=1
    void say(Uint a){
        A..cc=90
        cc =12
        this.a=a;
        this.a = this.a
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
        this.a=1
    }
}

class D::C,B{
    int age;
    static string name;
    void say(){
        name ="fefe"
        age =1;
        B.age =23;
        B.A.age =23;
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

    Int print(){Int a,String d}{
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

class C :: P,M{
    Int age;
    void say(){
        print(P..age)
    }
}
class S :: C,P{
    static 

   const void say(){ //重写
        P..age
        age
    }
}