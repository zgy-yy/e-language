
 struct A{
        [2]int a;
        int b;
    }


int main(){
[2]A cc=[{
    a:[1,9],
    b:3
},{
    a:[1,3],
    b:3
}];

cc[0].a[1]=99;

print cc[0].a[1];
    return 0;
}