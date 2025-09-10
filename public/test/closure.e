
int main(){
    (int)int fn=(int i)int{
        if(i<=0){
            return 0;
        }
        return i+fn(i-1);
    };

    int n = fn(3);
    print n;
    return 0;
}