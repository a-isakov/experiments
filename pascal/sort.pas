Program sort;
const nmax=100;
var a: array [1..nmax] of integer;
i,j,n,p: integer;
begin 
    read(n);
    for i:=1 to n do 
        read(a[i]);
    for i:=1 to n-1 do
    begin
        for j:=i+1 to n do
        begin
            if a[i]>a[j] then 
            begin
                p:=a[i];
                a[i]:=a[j];
                a[j]:=p;
            end;
        end;
    end;
    for i:=1 to n do
        write(a[i], ', ');
end.