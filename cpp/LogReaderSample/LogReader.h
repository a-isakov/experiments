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

private:
	DWORD m_clusterSize;
};
