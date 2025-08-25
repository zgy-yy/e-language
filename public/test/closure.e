
int a=12;

(int)void foo(){

    (int) void fn;
    for( int c=0;c<3;c++){
        void bar(int i){
            print c;
            print i;
        }
        fn = bar;
    }
    return fn;
}



int main(){
    (int)void fn = foo();
    (int)void fun = foo();
    fn(1);
    fun(1);

    return 23;
}