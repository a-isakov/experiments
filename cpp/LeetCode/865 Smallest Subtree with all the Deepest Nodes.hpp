/*
https://leetcode.com/problems/smallest-subtree-with-all-the-deepest-nodes/
Given a binary tree rooted at root, the depth of each node is the shortest distance to the root.

A node is deepest if it has the largest depth possible among any node in the entire tree.

The subtree of a node is that node, plus the set of all descendants of that node.

Return the node with the largest depth such that it contains all the deepest nodes in its subtree.

Example 1:

Input: [3,5,1,6,2,0,8,INT32_MIN,INT32_MIN,7,4]
Output: [2,7,4]
Explanation:

We return the node with value 2, colored in yellow in the diagram.
The nodes colored in blue are the deepest nodes of the tree.
The input "[3, 5, 1, 6, 2, 0, 8, INT32_MIN, INT32_MIN, 7, 4]" is a serialization of the given tree.
The output "[2, 7, 4]" is a serialization of the subtree rooted at the node with value 2.
Both the input and output have TreeNode type.
*/

#include <vector>
#include <algorithm>
#include <unordered_map>

using namespace std;

struct TreeNode {
	int val;
	TreeNode* left;
	TreeNode* right;
	TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
	TreeNode* subtreeWithAllDeepest(TreeNode* root) {
		char i = 0;
		return find(root, i);
	}

	TreeNode* subtreeWithAllDeepestSlow(TreeNode* root) {
		if (!root || (!root->left && !root->right))
			return root;

		unordered_map<TreeNode*, char> map;
		count(root, map);
		TreeNode* inspect = root;
		while (true)
		{
			char lLevel = inspect->left ? map[inspect->left] : -1;
			char rLevel = inspect->right ? map[inspect->right] : -1;
			if (lLevel == rLevel)
				return inspect;
			else if (lLevel > rLevel)
				inspect = inspect->left;
			else
				inspect = inspect->right;
		}

		return nullptr;
	}
protected:
	TreeNode* find(TreeNode* node, char& index)
	{
		if (!node)
			return node;

		char lIndex = 0;
		TreeNode* left = find(node->left, lIndex);
		char rIndex = 0;
		TreeNode* right = find(node->right, rIndex);

		if (lIndex == rIndex)
		{
			index = lIndex + 1;
			return node;
		}
		else if (lIndex < rIndex)
		{
			index = rIndex + 1;
			return right;
		}
		else
		{
			index = lIndex + 1;
			return left;
		}
	}

	void count(TreeNode* node, unordered_map<TreeNode*, char>& map)
	{
		char lLevel = 0;
		char rLevel = 0;
		if (node->left)
		{
			count(node->left, map);
			lLevel = map[node->left] + 1;
		}
		if (node->right)
		{
			count(node->right, map);
			rLevel = map[node->right] + 1;
		}
		map[node] = max(lLevel, rLevel);
	}

public:
	TreeNode* buildTree(vector<int> v)
	{
		vector<int>::iterator it = v.begin();
		TreeNode* root = new TreeNode(*it);
		if (it != v.end())
		{
			vector<TreeNode*> parents = {root};
			readChildren(parents, ++it, v.end());
		}
		return root;
	}

	void readChildren(vector<TreeNode*>& parents, vector<int>::iterator& it, vector<int>::iterator end)
	{
		vector<TreeNode*> children;
		for (vector<TreeNode*>::iterator pi = parents.begin(); pi != parents.end(); pi++)
		{
			if (*pi)
			{
				if (it == end)
					return;
				if (*it == INT32_MIN)
					children.push_back(nullptr);
				else
				{
					TreeNode* left = new TreeNode(*it);
					(*pi)->left = left;
					children.push_back(left);
				}
				it++;
				if (it == end)
					return;
				if (*it == INT32_MIN)
					children.push_back(nullptr);
				else
				{
					TreeNode* right = new TreeNode(*it);
					(*pi)->right = right;
					children.push_back(right);
				}
				it++;
			}
		}
		readChildren(children, it, end);
	}

	vector<int> serialize(TreeNode* root)
	{
		vector<int> v;
		intoV(root, v);
		return v;
	}
protected:
	void intoV(TreeNode* node, vector<int>& v)
	{
		if (node)
		{
			v.push_back(node->val);
			intoV(node->left, v);
			intoV(node->right, v);
		}
	}
};

void testSmallestTree()
{
	Solution sol;
	std::vector<int> v = { 3,5,1,6,2,0,8,INT32_MIN,INT32_MIN,7,4 };
	std::vector<int> vc = { 2,7,4 };
	std::cout << "Test 1 " << std::string(sol.serialize(sol.subtreeWithAllDeepest(sol.buildTree(v))) == vc ? "passed" : "FAILED") << "\n";

	v = { 1 };
	vc = { 1 };
	std::cout << "Test 2 " << std::string(sol.serialize(sol.subtreeWithAllDeepest(sol.buildTree(v))) == vc ? "passed" : "FAILED") << "\n";

	v = { 0,1,3,INT32_MIN,2 };
	vc = { 2 };
	std::cout << "Test 3 " << std::string(sol.serialize(sol.subtreeWithAllDeepest(sol.buildTree(v))) == vc ? "passed" : "FAILED") << "\n";

	v = { 0,2,1,INT32_MIN,INT32_MIN,3 };
	vc = { 3 };
	std::cout << "Test 4 " << std::string(sol.serialize(sol.subtreeWithAllDeepest(sol.buildTree(v))) == vc ? "passed" : "FAILED") << "\n";

	v = { 0,3,1,4,INT32_MIN,2,INT32_MIN,INT32_MIN,6,INT32_MIN,5 };
	vc = { 0,3,4,6,1,2,5 };
	std::cout << "Test 5 " << std::string(sol.serialize(sol.subtreeWithAllDeepest(sol.buildTree(v))) == vc ? "passed" : "FAILED") << "\n";

	v = { 0,1,29,2,3,41,43,11,4,INT32_MIN,5,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,27,15,18,7,19,6,INT32_MIN,36,INT32_MIN,33,INT32_MIN,INT32_MIN,8,10,INT32_MIN,22,INT32_MIN,17,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,16,9,20,12,23,28,INT32_MIN,39,34,INT32_MIN,14,INT32_MIN,46,42,26,13,31,INT32_MIN,30,48,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,37,INT32_MIN,47,INT32_MIN,INT32_MIN,45,INT32_MIN,21,44,INT32_MIN,INT32_MIN,INT32_MIN,35,INT32_MIN,49,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,24,32,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,25,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,38,INT32_MIN,40 };
	vc = { 40 };
	std::cout << "Test 6 " << std::string(sol.serialize(sol.subtreeWithAllDeepest(sol.buildTree(v))) == vc ? "passed" : "FAILED") << "\n";

	v = { 0,216,1,411,251,2,9,INT32_MIN,INT32_MIN,264,INT32_MIN,14,3,18,35,476,INT32_MIN,21,362,6,4,84,39,54,48,INT32_MIN,INT32_MIN,32,27,INT32_MIN,INT32_MIN,7,19,11,5,INT32_MIN,112,56,49,77,180,74,INT32_MIN,37,INT32_MIN,59,100,20,8,266,26,16,24,15,12,138,260,INT32_MIN,170,51,302,INT32_MIN,85,INT32_MIN,233,101,454,122,61,81,345,245,154,31,66,13,10,INT32_MIN,395,INT32_MIN,36,33,17,44,38,91,30,34,40,333,227,446,343,218,INT32_MIN,92,70,INT32_MIN,INT32_MIN,INT32_MIN,99,497,INT32_MIN,468,102,INT32_MIN,INT32_MIN,327,147,117,62,104,87,INT32_MIN,372,257,INT32_MIN,INT32_MIN,294,96,57,75,413,25,63,42,90,INT32_MIN,INT32_MIN,52,64,45,68,22,23,76,116,INT32_MIN,60,INT32_MIN,151,238,228,78,131,INT32_MIN,134,INT32_MIN,451,INT32_MIN,382,INT32_MIN,INT32_MIN,469,INT32_MIN,348,INT32_MIN,201,111,492,298,267,172,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,182,INT32_MIN,INT32_MIN,INT32_MIN,250,186,305,220,80,86,175,INT32_MIN,385,97,416,429,INT32_MIN,INT32_MIN,INT32_MIN,383,INT32_MIN,160,INT32_MIN,120,225,262,INT32_MIN,INT32_MIN,124,28,118,110,71,INT32_MIN,103,98,82,162,241,73,121,INT32_MIN,INT32_MIN,265,46,69,41,55,INT32_MIN,INT32_MIN,129,288,126,105,INT32_MIN,152,428,408,INT32_MIN,INT32_MIN,83,143,244,312,INT32_MIN,214,INT32_MIN,INT32_MIN,INT32_MIN,488,INT32_MIN,INT32_MIN,452,INT32_MIN,208,311,287,141,INT32_MIN,INT32_MIN,314,INT32_MIN,270,INT32_MIN,291,253,INT32_MIN,INT32_MIN,309,338,INT32_MIN,423,INT32_MIN,INT32_MIN,277,299,135,156,114,443,INT32_MIN,356,387,INT32_MIN,200,153,INT32_MIN,461,INT32_MIN,433,INT32_MIN,INT32_MIN,290,INT32_MIN,276,352,306,240,INT32_MIN,INT32_MIN,188,169,29,53,165,178,INT32_MIN,132,194,232,316,205,158,296,211,93,INT32_MIN,179,INT32_MIN,INT32_MIN,INT32_MIN,419,146,INT32_MIN,272,279,89,50,88,246,168,119,72,58,231,140,450,417,230,176,315,149,207,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,409,95,148,167,489,INT32_MIN,328,368,359,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,467,217,INT32_MIN,INT32_MIN,355,INT32_MIN,330,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,426,394,INT32_MIN,334,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,278,357,INT32_MIN,INT32_MIN,185,INT32_MIN,INT32_MIN,INT32_MIN,133,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,331,INT32_MIN,174,366,INT32_MIN,INT32_MIN,INT32_MIN,439,459,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,407,367,INT32_MIN,318,301,INT32_MIN,INT32_MIN,171,43,47,199,144,379,249,INT32_MIN,INT32_MIN,166,444,INT32_MIN,INT32_MIN,INT32_MIN,310,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,203,226,INT32_MIN,INT32_MIN,INT32_MIN,256,195,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,213,285,INT32_MIN,404,INT32_MIN,472,145,177,123,INT32_MIN,127,106,397,INT32_MIN,424,346,INT32_MIN,173,109,79,65,137,393,INT32_MIN,INT32_MIN,283,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,386,INT32_MIN,204,193,INT32_MIN,353,187,INT32_MIN,415,300,INT32_MIN,INT32_MIN,161,INT32_MIN,189,181,190,INT32_MIN,INT32_MIN,INT32_MIN,449,INT32_MIN,INT32_MIN,398,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,274,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,442,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,284,INT32_MIN,402,INT32_MIN,215,INT32_MIN,INT32_MIN,336,INT32_MIN,INT32_MIN,470,317,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,323,INT32_MIN,INT32_MIN,341,INT32_MIN,INT32_MIN,67,155,197,198,INT32_MIN,297,INT32_MIN,435,INT32_MIN,INT32_MIN,354,255,INT32_MIN,375,480,INT32_MIN,INT32_MIN,INT32_MIN,360,252,374,INT32_MIN,406,482,INT32_MIN,INT32_MIN,286,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,191,271,INT32_MIN,282,INT32_MIN,235,498,273,107,457,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,400,361,380,125,222,128,108,94,329,434,295,INT32_MIN,437,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,219,INT32_MIN,462,INT32_MIN,445,236,319,INT32_MIN,INT32_MIN,339,INT32_MIN,163,326,209,INT32_MIN,392,258,196,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,412,471,499,INT32_MIN,448,324,INT32_MIN,INT32_MIN,INT32_MIN,391,242,INT32_MIN,475,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,390,INT32_MIN,261,130,237,184,313,INT32_MIN,281,487,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,425,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,414,466,INT32_MIN,453,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,292,478,192,INT32_MIN,293,303,INT32_MIN,370,248,INT32_MIN,INT32_MIN,INT32_MIN,430,INT32_MIN,139,304,465,477,INT32_MIN,INT32_MIN,INT32_MIN,364,INT32_MIN,INT32_MIN,INT32_MIN,229,320,INT32_MIN,183,INT32_MIN,212,113,496,INT32_MIN,INT32_MIN,340,INT32_MIN,INT32_MIN,381,INT32_MIN,INT32_MIN,INT32_MIN,221,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,335,388,INT32_MIN,INT32_MIN,INT32_MIN,363,INT32_MIN,440,INT32_MIN,INT32_MIN,325,247,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,289,INT32_MIN,INT32_MIN,432,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,484,INT32_MIN,INT32_MIN,321,269,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,373,485,403,344,243,254,202,INT32_MIN,473,347,455,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,308,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,142,INT32_MIN,INT32_MIN,369,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,436,INT32_MIN,376,420,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,115,263,INT32_MIN,INT32_MIN,INT32_MIN,399,INT32_MIN,INT32_MIN,371,234,351,INT32_MIN,474,INT32_MIN,441,INT32_MIN,INT32_MIN,INT32_MIN,483,418,INT32_MIN,INT32_MIN,358,427,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,349,INT32_MIN,365,INT32_MIN,389,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,384,438,INT32_MIN,410,INT32_MIN,INT32_MIN,378,350,INT32_MIN,479,INT32_MIN,INT32_MIN,INT32_MIN,464,INT32_MIN,332,405,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,447,136,164,280,INT32_MIN,401,INT32_MIN,456,INT32_MIN,INT32_MIN,422,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,486,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,493,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,458,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,490,INT32_MIN,INT32_MIN,INT32_MIN,494,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,150,157,206,396,INT32_MIN,337,INT32_MIN,INT32_MIN,INT32_MIN,495,INT32_MIN,481,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,159,210,307,377,259,INT32_MIN,INT32_MIN,421,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,268,INT32_MIN,431,223,INT32_MIN,342,INT32_MIN,491,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,460,275,224,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,INT32_MIN,322,239,463 };
	vc = { 463 };
	std::cout << "Test 7 " << std::string(sol.serialize(sol.subtreeWithAllDeepest(sol.buildTree(v))) == vc ? "passed" : "FAILED") << "\n";
}