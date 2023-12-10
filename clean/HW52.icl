module sample
import StdEnv

/*
 1. Given 2-D list of tuple (Int, Int), return the tuple (Int,Int), 
	where the first Int represents the summation of all the first Int in all tuples, and
 	      the second Int represents the summation of all the second Int in all tuples. 
*/

/*foldr (\tuple (sum1, sum2) = (sum1 + fst tuple, sum2 + snd tuple) (0, 0) [t \\ ts <- list, t <- ts])

sumTupleList :: [[(Int,Int)]] -> (Int, Int)
sumTupleList ls = sumTuples (map sumTuples ls)
where
	sumTuples :: [(Int, Int)] -> (Int, Int)
	sumTuples ts = foldr (\(curr1, curr2) -> \(prev1, prev2) -> (prev1 + curr1, prev2 + curr2)) (0, 0) ts*/

//Start = flatten [[(7,6),(-5,8),(4,-3)],[(5,-8)],[(-2,3),(0,6),(7,5),(9,5)]]

/*sumtup :: [(Int, Int)] -> (Int, Int)
sumtup list = (sum (fst(unzip list)), sum (snd(unzip list)))


sumTupleList :: [[(Int,Int)]] -> (Int, Int)
sumTupleList lss = sumtup (flatten lss)*/


//Start = sumTupleList [[(7,6),(-5,8),(4,-3)],[(5,-8)],[(-2,3),(0,6),(7,5),(9,5)]] // (25,22)
//Start = sumTupleList [[],[]] // (0,0)
//Start = sumTupleList [[(-1,-4),(-5,-3)],[],[(1,0)]] // (-5, -7)
//Start = sumTupleList [] // (0,0)

/*
 2. A matrix is give, 
    traverse all the even numbers by creating a list of 3 elements tuple (value, row index, column index).
	Indexing is 0-based indexing, meaning: the index of the first element is 0.
*/

//traverseMatrix :: [[Int]] -> [(Int, Int, Int)]
//traverseMatrix elements = foldr (++) [] (map (\(row, l) -> filter (\(num, _, _) -> num rem 2 == 0) (map (\(val, col) -> (val, row, col)) (zip2 l (indexList l)))) (zip2 (indexList elements) elements))

//traverseMatrix :: [[Int]] -> [Int]
//traverseMatrix lss = [ls \\ ls <- indexList lss] // [0,1,2,3]

//addRowNumbers :: [[Int]] ->  [(Int,[Int])]
//addRowNumbers lss = [(rowNumber, ls) \\ rowNumber <- indexList lss & ls <- lss]

addRowsColumns :: [[Int]] -> [(Int, Int, Int)]
addRowsColumns lss = [(value, rowIndex, colIndex) \\ rowIndex <- indexList lss & ls <- lss, colIndex <- indexList ls & value <- ls]

isValid :: (Int, Int, Int) -> Bool
isValid (x, y, z)
| x rem 2 == 0 = True
| otherwise = False

traverseMatrix :: [[Int]] -> [(Int, Int, Int)]
traverseMatrix x = filter isValid (addRowsColumns x)

//Start = addRowNumbers [[5,7,4,2],[0,-1,8],[-4,9,0,8],[7,9,1,-1]] // [(0,[5,7,4,2]),(1,[0,-1,8]),(2,[-4,9,0,8]),(3,[7,9,1,-1])]
//Start = addRowsColumns [[5,7,4,2],[0,-1,8],[-4,9,0,8],[7,9,1,-1]] // [(5,0,0),(7,0,1),(4,0,2),(2,0,3),(0,1,0),(-1,1,1),(8,1,2),(-4,2,0),(9,2,1),(0,2,2),(8,2,3),(7,3,0),(9,3,1),(1,3,2),(-1,3,3)]
//Start = filter isValid (addRowsColumns [[5,7,4,2],[0,-1,8],[-4,9,0,8],[7,9,1,-1]])

Start = traverseMatrix [[5,7,4,2],[0,-1,8],[-4,9,0,8],[7,9,1,-1]] // [(4,0,3),(2,0,4),(0,1,1),(8,1,3),(-4,2,1),(0,2,3),(8,2,4)]
//Start = traverseMatrix [[],[8,4,2]] // [(8,1,0),(4,1,1),(2,1,2)]
//Start = traverseMatrix [] // []
//Start = traverseMatrix [[-3,-5,-5,-3],[-5,-2,0]] // [(-2,1,1),(0,1,2)]

//Start = zip2 [1, 2, 3] [4, 5, 6] // [(1,4),(2,5),(3,6)]
//Start = map (1, 2, 3)

//Start = [ ( x , y, z) \\ x <- [1..2] , y <- [4..5] , z <- [7..8]] // [(1,4,7),(1,4,8),(1,5,7),(1,5,8),(2,4,7),(2,4,8),(2,5,7),(2,5,8)]