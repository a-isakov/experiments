Program task_o;
var i, n, x, d: longint;
begin
  read (x);
  read (d);
  read (n);
  for i:=1 to n do
  begin
    write (x, ' ');
    x := x + d;
  end;
end.