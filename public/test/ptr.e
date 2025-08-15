

int main(){
    int a=12;

    int@ a_ptr => a;

    a_ptr =>a;
    a_ptr=4;
    print a_ptr;
    print a;
    return 0;
}