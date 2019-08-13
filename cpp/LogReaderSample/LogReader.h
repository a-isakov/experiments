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

#ifdef TESTARRAY
public:
#endif
	template <class T>
	class CArray
	{
	public:
		CArray(const size_t capacity);
		//CArray(CArray<T> const&& rhv) noexcept;
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
		//CLogLine(CLogLine const&& rhv)  noexcept;
		bool AppendBytes(char* buf, const size_t size);
		size_t Size();
		char& operator[](const size_t i);
		void Clear();
		bool Matches(CArray<SRule>& rules);
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
		bool GetLine(CLogLine& logLine);

	private:
		char* GetRootPath(const char* fileName);
		void CalcClusterSize(const char* fileName);
		bool ReadBlock();

	private:

		HANDLE m_file;
		DWORD m_clusterSize;
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
