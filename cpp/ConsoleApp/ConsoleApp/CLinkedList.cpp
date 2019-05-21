#include "pch.h"
#include "CLinkedList.h"


template<class ItemType>
inline CLinkedList<ItemType>::CNode::CNode()
{
	next = nullptr;
}

template<class ItemType>
void CLinkedList<ItemType>::CNode::SetNext(const CNode* nextItem)
{
	next = nextItem;
}

template<class ItemType>
CLinkedList<ItemType>::CLinkedList()
{
	head = nullptr;
}

template<class ItemType>
CLinkedList<ItemType>::~CLinkedList()
{
}

template<class ItemType>
void CLinkedList<ItemType>::AddToHead(const ItemType newItem)
{
	if (!head)
	{
		head = new CNode();
	}
	else
	{
		CNode* newNode = new CNode();
		newNode->SetNext(head);
		head = newNode;
	}
	head->item = newItem;
}