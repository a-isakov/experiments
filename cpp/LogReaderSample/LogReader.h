#pragma once

#include <Windows.h>

class CLogReader
{
public:
	CLogReader(const char* fileName);
	~CLogReader();
	bool Open(); // открытие файла, false - ошибка
	void Close(); // закрытие файла
	bool SetFilter(const char* filter); // установка фильтра строк, false - ошибка
	bool GetNextLine(char* buf, const int bufsize); // запрос очередной найденной строки, buf - буфер, bufsize - максимальная длина, false - конец файла или ошибка

private:
	void InitCalcClusterSize();
	bool AddChunk();

private:
	struct Chunk
	{
		Chunk(const size_t bytes) :
			buffer(nullptr),
			next(nullptr)
		{
			buffer = (BYTE*)malloc(bytes);
		}
		~Chunk()
		{
			if (buffer)
				free(buffer);
		}
		BYTE* buffer;
		Chunk* next;
	};

private:
	bool m_initSucceeded; // True if initialized well, false if should not proceed with any action
	char* m_filter;
	HANDLE m_file;
	DWORD m_clusterSize;
	DWORD m_chunks;
	Chunk* m_firstChunk;
	Chunk* m_lastChunk;
};
