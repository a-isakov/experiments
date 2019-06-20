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
