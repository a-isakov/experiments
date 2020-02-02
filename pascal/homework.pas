program homework;

procedure Task8(number: Integer);
var
    number_copy: Integer;
    reverse: Integer;
    digit: Integer;
begin
    reverse := 0;
    number_copy := number;
    while number_copy > 0 do
    begin
        digit := number_copy MOD 10;
        number_copy := number_copy DIV 10;
        reverse := reverse * 10 + digit;
    end;
    Write('Число ');
    Write(number);
    if number = reverse then
    begin
        Writeln(' палиндром');
    end
    else
    begin
        Writeln(' не палиндром');
    end;
end;

procedure Task9(number: Integer);
var
    number_copy: Integer;
    digit: Integer;
    count2: Integer;
    count5: Integer;
begin
    number_copy := number;
    digit := 0;
    count2 := 0;
    count5 := 0;
    while number > 0 do
    begin
        digit := number MOD 10;
        case digit of
            2: begin Inc(count2) end;
            5: begin Inc(count5) end;
        end;
        number := number DIV 10;
    end;
    Write('Число ');
    Write(number_copy);
    Write(' имеет ');
    Write(count2);
    Write(' двоек и ');
    Write(count5);
    Writeln(' пятёрок');
end;

procedure Task10(number: Integer);
var
    number_copy: Integer;
    digits: Integer;
    first_digit: Integer;
    last_digit: Integer;
begin
    digits := 0;
    number_copy := number;
    last_digit := number MOD 10;
    while number_copy > 0 do
    begin
        Inc(digits);
        first_digit := number_copy MOD 10;
        number_copy := number_copy DIV 10;
    end;
    Dec(digits);
    Write(number);
    Write(' => ');
    Writeln(number - last_digit + first_digit - Round(first_digit*Exp(digits*Ln(10))) + Round(last_digit*Exp(digits*Ln(10))));
end;

begin
    // Task8(123);
    // Task8(12321);
    // Task9(12525);
    // Task9(123);
    // Task9(1346);
    Task10(123);
    Task10(1346);
end.