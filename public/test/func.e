

void bar(int a){
    if(a==9){
       return;
    }
    print a;
    bar(a+1);
}

(int)void call(){
    bool a = true;
    bool b=false;
    a = false;
    return bar;
}


void main(){
    (int)void foo =  call();
   foo(1);
   call()(1);
}

