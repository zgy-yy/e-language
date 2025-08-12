
 struct A{
        int a,b;
        bool c;
    }


struct B{
    int i;
    A a;
}


int main(){

    [3]int arr =[1,2,3];
    int a =arr[0]++;
    print a;
    print arr[0];
    return 0;
}