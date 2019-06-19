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

		TreeNode* subTree =  nullptr;

		vector<TreeNode*> v(500, nullptr); // Change to TreeNode
		size_t max = 0;
		plain(root, v, 0, max);
		size_t rEnd = max;

		bool found = false;
		while (!found && rEnd)
		{
			if (!(rEnd & 1)) // Even
			{
				if (v[rEnd] && v[rEnd - 1])
				{
					TreeNode* parent = v[(rEnd - 1) / 2];
					if (parent->left && parent->right)
					{
						found = true;
						subTree = v[(rEnd - 1) / 2];
					}
				}
			}
			if (!found && v[rEnd])
			{
				if (v[rEnd]->right)
				{
					found = true;
					subTree = v[rEnd]->right;
				}
				if (v[rEnd]->left)
				{
					found = true;
					subTree = v[rEnd]->left;
				}
			}
			rEnd--;
		}

		// Remove before submit
		//clean(root);

		return subTree;
	}

protected:
	void plain(TreeNode* node, vector<TreeNode*>& v, size_t i, size_t& max)
	{
		v[i] = node;
		if (node->left)
			plain(node->left, v, (i + 1) * 2 - 1, max);
		if (node->right)
			plain(node->right, v, (i + 1) * 2, max);
		if (i > max)
			max = i;
	}

public:
	TreeNode* buildTree(vector<int> v)
	{
		vector<TreeNode*> t(v.size());
		size_t parentIndex = 0;
		//size_t parentsInLevel = 1;
		for (size_t i = 0; i < v.size(); i++)
		{
			if (!i) // Root
				t[i] = new TreeNode(v[i]);
			else
			{
				if (v[i] == INT32_MIN)
					t[i] = nullptr;
				else
					t[i] = new TreeNode(v[i]);

				if (i & 1) // Odd
					t[parentIndex]->left = t[i];
				else // Even
				{
					t[parentIndex]->right = t[i];
					parentIndex++;
				}
			}
			//if (v[i] == INT32_MIN)
			//	t[i] = nullptr;
			//else
			//	t[i] = new TreeNode(v[i]);
			//if (i)
			//{
			//	size_t parent = (i - 1) / 2;
			//	if (i & 1) // Odd
			//		t[parent]->left = t[i];
			//	else // Even
			//		t[parent]->right = t[i];
			//}
		}
		return t[0];
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

	void clean(TreeNode* node)
	{
		if (node->left)
			clean(node->left);
		if (node->right)
			clean(node->right);
		delete node;
	}
};
