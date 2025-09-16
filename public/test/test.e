

struct Iner{
    int c;
}

struct St {
    int a;
    bool b;
    Iner in;
}


int main() {

St t ={
    a:23,
    b:false,
    in:{
        c:12
    }
};
t.in.c =78;
print t.in.c;


   [int,int] tup =[90,23];

   print tup[1];
    return 0;
}