/*
The string "PAYPALISHIRING" is written in a zigzag pattern on a given number of rows like this: (you may want to display this pattern in a fixed font for better legibility)

P   A   H   N
A P L S I I G
Y   I   R
And then read line by line: "PAHNAPLSIIGYIR"

Write the code that will take a string and make this conversion given a number of rows:

string convert(string s, int numRows);
Example 1:

Input: s = "PAYPALISHIRING", numRows = 3
Output: "PAHNAPLSIIGYIR"
Example 2:

Input: s = "PAYPALISHIRING", numRows = 4
Output: "PINALSIGYAHRPI"
Explanation:

P     I    N
A   L S  I G
Y A   H R
P     I
*/

#include <string>
#include <unordered_map>
#include <vector>
#include <stack>

using namespace std;

class Solution {
public:
    string convert(string s, int numRows) {
        if (numRows < 2)
            return s;
        
        int mids = numRows > 2 ? numRows - 2 : 0;
        int curveSize = numRows + mids;
        
        string ret;
        ret.reserve(s.length());
        for (int row = 0; row < numRows; row++)
        {
            int col = 0;
            int index = 0;
            while (index < s.length())
            {
                if (row == 0) // First row
                    index = col*curveSize;
                else if (row == numRows - 1) // Last row
                    index = col*curveSize + row;
                else
                {
                    // Mid row
                    if (col%2) // Odd
                        index = (col/2 + 1)*curveSize - row;
                    else // Even (vertical)
                        index = (col/2)*curveSize + row;
                }
                if (index < s.length())
                    ret += s[index];
                col++;
            }
        }
        return ret;
    }
};
