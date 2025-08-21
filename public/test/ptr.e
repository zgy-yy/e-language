

struct St{
    [2]int age;
    bool is;
}

int main(){ 

    [2]St a=[{
        age:[23,56],
        is:false
    },{
        age:[21,45],
        is:true
    }];

    print a[0].age[1];

    return 0;
}