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

#ifdef TESTARRAY
public:
#endif
	template <class T>
	class CArray
	{
	public:
		CArray(const size_t capacity);
		CArray(CArray<T> const&& rhv) noexcept;
		CArray<T>& operator=(CArray<T>&& rhv) noexcept;
		~CArray();
		size_t Size();
		bool Append(T&& item);
		bool Append(const T* items, size_t count, bool keepTail = false);
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

#ifdef TESTLOGLINE
public:
#endif
#ifdef TESTMATCH
public:
#endif
	class CLogLine
	{
	public:
		CLogLine();
		//CLogLine(CLogLine const&& rhv)  noexcept;
		bool AppendBytes(const char* buf, const size_t size);
		size_t Size();
		char& operator[](const size_t i);
		void Clear();
		bool Matches(const char* filter);
	private:
#ifdef TESTLOGLINE
	public:
#endif
		CArray<char> m_str;
	}; // class CLogLine
#ifdef TESTLOGLINE
private:
#endif
#ifdef TESTMATCH
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
	CLogLine m_filter;

#ifdef TESTROOTPATH
public:
	// TESTS
	static char* testRootPath(const char* fileName)
	{
		return CFileHelper::TestGetRootPath(fileName);
	}
#endif
}; // class CLogReader
