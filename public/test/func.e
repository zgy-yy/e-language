void bar(int a,b){
    if(a==9){
       return;
    }
    print a+b;
    bar(++a,b);
}

(int,int)void call(){
    bool a = true;
    bool b=false;
    a = false;
    return bar;
}


void main(){
    (int,int)void foo =  call();
   foo(1,2);
}

