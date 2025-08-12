
 struct A{
        int a,b;
        bool c;
    }


struct B{
    int i;
    A a;
}


int main(){
    A sh={
        a:12,
        b:4,
        c:false
    };
    B bb = {
        i:1,
        a:sh
    };
   bb.a.b++;
   print bb.a.b;
   print sh.b;

    return 0;
}