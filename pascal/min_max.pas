Program max_min;
const nmax=100;
var a: array [1..nmax] of integer;
max, i, n, min: Integer;
begin
    read (n);
    for i:=1 to n do read(a[i]);
    max:=a[1];
    min:=a[1];
    for i:=2 to n do begin
        if max<a[i] then max:=a[i];
        if min>a[i] then min:=a[i];
    end;
    write(max,' ', min);
end.