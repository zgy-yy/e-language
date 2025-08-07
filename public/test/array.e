

 struct A{
        int a,b;
        bool c;
    }

[2]int foo(){

    [2]int arr=[1,2];
    return arr;
}

int main(){
    [2]int c  = foo();
    print c[1];

    return 0;
}