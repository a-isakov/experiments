module sample
import StdEnv


int2str :: Int -> String
int2str 0 = "zero"
int2str 1 = "one"
int2str 2 = "two"
int2str 3 = "three"
int2str 4 = "four"
int2str 5 = "five"
int2str 6 = "six"
int2str 7 = "seven"
int2str 8 = "eight"
int2str 9 = "nine"


helpInt :: Int String -> String 
helpInt n str
| (n < 10) = str +++ int2str n
| (n > 10) = str +++ helpInt (n / 10) str


intString :: Int -> String
intString n = helpInt n ""


Start = intString 43
