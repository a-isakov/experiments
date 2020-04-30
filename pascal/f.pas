Program f;
const nmax=10000;
var ar: array [1..nmax] of longint;
 n, a, b, i, c, x: longint;
begin
  read (a);
  read (b);
  read (n);
  randomize;
  for i := 1 to n do
  begin
    ar[i] := Random (b - a) + a;
    write (ar[i], ' ');
  end;

  c := 0;
  for i := 1 to n do
  begin
    x := ar[i] div 10;
    x := x mod 10;
    if x mod 2 = 0 then c := c + 1;
  end;
  writeln ('');
  write (c);
end.