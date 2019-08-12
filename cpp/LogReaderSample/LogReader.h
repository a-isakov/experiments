#pragma once

#include <Windows.h>
#include "TestDef.h"

class CLogReader
{
public:
	CLogReader();
	~CLogReader();
	bool Open(const char* fileName); // �������� �����, false - ������
	void Close(); // �������� �����
	bool SetFilter(const char* filter); // ��������� ������� �����, false - ������
	bool GetNextLine(char* buf, const int bufsize); // ������ ��������� ��������� ������, buf - �����, bufsize - ������������ �����, false - ����� ����� ��� ������

private:
	void CleanRules();

	struct SRule
	{
		SRule() : pattern(nullptr), next(nullptr) {}
		~SRule();
		bool AddChar(char c);
		bool AddRule(char c);
		char* pattern;
		SRule* next;
	}; // struct SRule

	class CFileHelper
	{
	public:
		CFileHelper();
		~CFileHelper();

		bool Open(const char* fileName);
		void Close();

		bool GetLine(const char* buf, const int bufsize);

	private:
		void CleanChunks();
		bool AddChunk();
		char* GetRootPath(const char* fileName);
		void CalcClusterSize(const char* fileName);

	private:
		struct SChunk
		{
			SChunk(const size_t bytes, const BYTE index) :
				buffer(nullptr),
				next(nullptr),
				i(index),
				bytes(0)
			{
				buffer = (BYTE*)::malloc(bytes + 1);
			}
			~SChunk()
			{
				if (buffer)
					::free(buffer);
			}
			BYTE* buffer;
			SChunk* next;
			BYTE i; // Index of the chunk
			DWORD bytes; // Bytes loaded into the buffer
		};

		HANDLE m_file;
		DWORD m_clusterSize;
		SChunk* m_firstChunk;
		SChunk* m_lastChunk;
		SChunk* m_currentChunk;
		int m_chunkPos;

#ifdef TESTROOTPATH
	public:
		// TESTS
		static char* TestGetRootPath(const char* fileName)
		{
			CFileHelper test;
			return test.GetRootPath(fileName);
		}
#endif
	}; // class CFileHelper

private:
	CFileHelper m_fileHelper;
	//char* m_filter;
	SRule* m_firstRule;

#ifdef TESTROOTPATH
public:
	// TESTS
	static char* testRootPath(const char* fileName)
	{
		return CFileHelper::TestGetRootPath(fileName);
	}
#endif
}; // class CLogReader
