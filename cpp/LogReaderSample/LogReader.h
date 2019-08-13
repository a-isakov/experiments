#pragma once

#include <Windows.h>
#include "TestDef.h"

class CLogReader
{
public:
	CLogReader();
	~CLogReader();
	bool Open(const char* fileName); // открытие файла, false - ошибка
	void Close(); // закрытие файла
	bool SetFilter(const char* filter); // установка фильтра строк, false - ошибка
	bool GetNextLine(char* buf, const int bufsize); // запрос очередной найденной строки, buf - буфер, bufsize - максимальная длина, false - конец файла или ошибка

private:
	void CleanRules();

#ifdef TESTARRAY
public:
#endif
	template <class T>
	class CArray
	{
	public:
		CArray(const size_t capacity);
		~CArray();
		size_t Size();
		bool Append(T&& item);
		bool Append(T* items, size_t count, bool keepTail = false);
		T& operator[](const size_t i);
		bool Alloc(const size_t capacity = 1, const bool resize = false);
		bool DoubleSize();
		void Clear();
	private:
		bool m_failed;
		size_t m_size;
		size_t m_capacity;
		T* m_array;
	}; // CArray
#ifdef TESTARRAY
private:
#endif

	struct SRule
	{
		SRule() : pattern(nullptr), next(nullptr) {}
		~SRule();
		bool AddChar(char c);
		bool AddRule(char c);
		char* pattern;
		SRule* next;
	}; // struct SRule

#ifdef TESTLOGLINE
public:
#endif
	class CLogLine
	{
	public:
		CLogLine();
		bool AppendBytes(char* buf, const size_t size);
	private:
#ifdef TESTLOGLINE
	public:
#endif
		CArray<char> m_str;
	}; // class CLogLine
#ifdef TESTLOGLINE
private:
#endif

	class CFileHelper
	{
	public:
		CFileHelper();
		~CFileHelper();

		bool Open(const char* fileName);
		void Close();

		bool GetLine(const char* buf, const int bufsize);

	private:
		//void CleanChunks();
		//bool AddChunk();
		char* GetRootPath(const char* fileName);
		void CalcClusterSize(const char* fileName);

	private:
		//struct SChunk
		//{
		//	SChunk(const size_t bytes, const BYTE index) :
		//		buffer(nullptr),
		//		next(nullptr),
		//		i(index),
		//		bytes(0)
		//	{
		//		buffer = (BYTE*)::malloc(bytes + 1);
		//	}
		//	~SChunk()
		//	{
		//		if (buffer)
		//			sfree(buffer);
		//	}
		//	BYTE* buffer;
		//	SChunk* next;
		//	BYTE i; // Index of the chunk
		//	DWORD bytes; // Bytes loaded into the buffer
		//};

		HANDLE m_file;
		DWORD m_clusterSize;
		//SChunk* m_firstChunk;
		//SChunk* m_lastChunk;
		//SChunk* m_currentChunk;
		//int m_chunkPos;
		DWORD m_bytesInBuffer;
		DWORD m_bufferIndex;
		CArray<char> m_buffer;

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
	//SRule* m_firstRule;
	CArray<SRule> m_rules;

#ifdef TESTROOTPATH
public:
	// TESTS
	static char* testRootPath(const char* fileName)
	{
		return CFileHelper::TestGetRootPath(fileName);
	}
#endif
}; // class CLogReader
