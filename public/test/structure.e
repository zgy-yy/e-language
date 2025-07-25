
 struct A{
        int a,b;
        bool c;
    }


struct B{
    int i;
    A a;
}

int main(){
    B ha={
        i:43,
        a:{
        a:1,c:true,b:6,
         }
    };
    print ha.a.b;

    return 0;
}