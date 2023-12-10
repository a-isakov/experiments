$Reader = New-Object System.IO.StreamReader(".\sample.txt")
 
while($Line = $Reader.ReadLine()) {
    # do something with each line
    # Write-host $Line
    $words = $Line -Split " "
    Write-host $words[0]
}
 
$Reader.Close()