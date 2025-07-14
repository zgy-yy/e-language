void bar(){
    print 1;
}

()void  foo(int a,int b){
    print 2;
    return bar;
}

void main(){

    ()void ff = foo(1,2);
    ff();
}

