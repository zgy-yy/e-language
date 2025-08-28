
struct St{
    int a;
}


int foo(){
    return 23;
}

St bar(){
 St s ={
        a:foo()
    };
    return s;
}
int main(){
   St s = bar();
   print s.a;
    return 23;
}