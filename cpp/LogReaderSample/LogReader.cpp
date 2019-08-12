#include "LogReader.h"

CLogReader::CLogReader(const char* fileName)
{
	InitCalcClusterSize();
}

CLogReader::~CLogReader()
{
}

// �������� �����, false - ������
bool CLogReader::Open()
{
	return false;
}

// �������� �����
void CLogReader::Close()
{
}

// ��������� ������� �����, false - ������
bool CLogReader::SetFilter(const char* filter)
{
	return false;
}

// ������ ��������� ��������� ������,
// buf - �����, bufsize - ������������ �����
// false - ����� ����� ��� ������
bool CLogReader::GetNextLine(char* buf, const int bufsize)
{
	return false;
}

void CLogReader::InitCalcClusterSize()
{
	DWORD dwSectorsPerCluster;
	DWORD dwBytesPerSector;
	DWORD dwNumberOfFreeClusters;
	DWORD dwTotalNumberOfClusters;
	if (!::GetDiskFreeSpace(NULL, &dwSectorsPerCluster, &dwBytesPerSector, &dwNumberOfFreeClusters, &dwTotalNumberOfClusters))
		m_clusterSize = 64 * 1024; // 65Kb supposed to be a max cluster size on NTFS
	else
		m_clusterSize = dwSectorsPerCluster * dwBytesPerSector;
}
