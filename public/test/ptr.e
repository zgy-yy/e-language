struct A{
    int age;
    bool is;
}

struct B{
    A a;
    bool c;
}

A a={
    is:true,
     age:12,
};
B b={
    a:a,
    c:false
};

int m =98;
int n = m;

B@ bp=>b;

[3]int arr =[1,2,3];
[3]int@ pa =>arr;

int main(){ 
    bp.a.age=5;
    print pa[0];
    pa[0]=88;
    print pa[0];

    return 0;
}