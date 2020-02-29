Program  F;
var 
n, m, r, a,b: longint; 
begin 
assign (Input, 'Input.txt');
reset (Input);
assign (Output,'Output.txt');
rewrite (Output);
read (a,b);
m:=a;
n:=b;
Repeat
    r:= a mod b;
    a:=b;
    b:=r;
until r=0;
m:= m div a;
n:= n div a;
If n>1 then begin write (m,'/',n) end;
If n=1 then begin write (m) end; 
end.