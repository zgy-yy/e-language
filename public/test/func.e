void bar(){
    print 1;
}

()void  foo(int a,int b){
    return bar;
}

void main(){
    ()void func= bar;
    func();
}

