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

private:
	DWORD m_clusterSize;
};
