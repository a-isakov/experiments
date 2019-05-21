#pragma once

template <class ItemType>
class CLinkedList
{
	class CNode
	{
	public:
		CNode();
		virtual ~CNode();

		void SetNext(const CNode* nextItem);

	protected:
		CNode* next;
		ItemType item;
	};

public:
	CLinkedList();
	virtual ~CLinkedList();

	void AddToHead(const ItemType newItem);

protected:
	CNode* head;
};
