Program f;
const nmax=10000;
var a: array [1..nmax] of longint;
 n, i, j, x: longint;
begin
  read (n);
  for j := 1 to n do
  begin
    write ('a[', j, ']=', a[j], ' ');
  end;
  writeln ('');

  x := n;

  for i := 1 to n do
  begin
    write ('x=', x, ': ');
    a[i] := x;
    x := x - 1;
    write ('i=', i, ': ');
    for j := 1 to n do write ('a[', j, ']=', a[j], ' '); writeln ('');
  end;
end.