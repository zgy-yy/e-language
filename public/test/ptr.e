
struct A{
    int a;
    bool b;
}
struct B{
    int i;
    A ba;
}
int main(){
    [3]int ar =[9,7,8];
   [2][3]int arr=[
    [1,2,3],
   ];
   arr[1] = ar;
   arr[1][2]=9;

    print arr[1][2];
    print ar[2];
    return 0;
}