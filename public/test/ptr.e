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

int main(){ 
   int c= ++a.age;
    print a.age;
    print ++c;

    return 0;
}