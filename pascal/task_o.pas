Program task_o;
const nmax=100;
var a:array [1..nmax] of integer;
max,n,i,kol,j: integer;
begin
    max:=0;
    max:=max+1;
    read(n);
    for i:=1 to n do 
    begin
        read (a[i]);
        read (j); 
        kol:=0;
    end;
    for i:=1 to n do 
    begin
        if j=a[i] then inc(kol);
    end;
    write (kol);
end.