Program poisk;
const nmax=100;
var a: array [1..nmax] of integer;
    i, kol, n, d: integer;
begin 
    read(n);
    for i := 1 to n do read(a[i]);
    read (d); 
    kol := 0;
    for i:=1 to n do
    begin
        if d = a[i] then inc (kol);
    end;
    write('Count:', kol);
end.