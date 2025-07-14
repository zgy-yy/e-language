void bar(){
    print 1;
}

()void  foo(int a,int b){
    return bar;
}

void main(){
    void  b= foo(1,3)();
    print b;
}

