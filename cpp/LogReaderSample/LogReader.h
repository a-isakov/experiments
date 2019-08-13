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
		size_t m_size; // Number of elements in the array
		size_t m_capacity; // Number of elements available to store
		T* m_array; // Storage itself
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
		CArray<char> m_str; // Buffer of the string. Used custom array to simplify few operations
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
		DWORD m_clusterSize; // Size of the disk cluster to optimize disk read
		DWORD m_bytesInBuffer; // Number of bytes written to the buffer
		DWORD m_bufferIndex; // Index of the current position in buffer. Used to read next line
		CArray<char> m_buffer; // Storage itself. Memory reserved equal to cluster size

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
	CFileHelper m_fileHelper; // For operations with log file
	CLogLine m_filter; // Filter mask

#ifdef TESTROOTPATH
public:
	// TESTS
	static char* testRootPath(const char* fileName)
	{
		return CFileHelper::TestGetRootPath(fileName);
	}
#endif
}; // class CLogReader
