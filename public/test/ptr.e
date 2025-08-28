link  fpt:ui,ffo,nwoij by "./arr.e";
link  foc by "./clos.e";

void  cc(){
    print 56;
}

()void boo(){

return cc;
}

int main(){ 
    ()void fc =  boo();
    fc();
    return 0;
}

expose cc,boo;