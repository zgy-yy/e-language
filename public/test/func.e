

void bar(int a){
    if(a==9){
       return;
    }
    print a;
    bar(a+1);
}

(int)void call(){
    return bar;
}


void main(){
    (int)void foo =  call();
   foo(1);
}

