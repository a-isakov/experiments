#pragma once

#include <Windows.h>

class CLogReader
{
public:
	CLogReader(const char* fileName);
	~CLogReader();
	bool Open(); // �������� �����, false - ������
	void Close(); // �������� �����
	bool SetFilter(const char* filter); // ��������� ������� �����, false - ������
	bool GetNextLine(char* buf, const int bufsize); // ������ ��������� ��������� ������, buf - �����, bufsize - ������������ �����, false - ����� ����� ��� ������

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
