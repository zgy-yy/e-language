

void bar(int a){
    if(a==9){
       return;
    }
    print a;
    bar(a+1);
}


void main(){
    bar(1);
}

