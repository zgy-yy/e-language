void bar(int a,b, (int)void c){
    if(a==9){
       return;
    }
    c(a+b);
    bar(++a,b,c);
}

(int,int,(int)void)void call(){
    bool a = true;
    bool b=false;
    a = false;
    return bar;
}

void pri(int a){
    print  a;
}

void main(){
    (int,int,(int)void )void foo =  call();
   foo(1,2,pri);
}

