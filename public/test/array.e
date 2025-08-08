

 struct A{
        int a,b;
        bool c;
    }

int main(){
    int a=0;
    a=a+1;
    for(int a=1;a<2;a++){
        print a;
    }
    if(a>4){
        print a;
    }else{
        print 2;
    }

    while(a<12){
        a++;
        print a;
    }

    do{
        print a;
        a=a+1;
    }while(a<15);


    A st ={
        a:1,b:23,
        c:true
    };
    st.a=st.a+23;
    st.a++;
    print st.a;

    return 0;
}