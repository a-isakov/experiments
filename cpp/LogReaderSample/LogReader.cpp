#include "LogReader.h"

CLogReader::CLogReader() :
	m_initSucceeded(false),
	m_filter(nullptr),
	m_file(INVALID_HANDLE_VALUE),
	m_clusterSize(64 * 1024), // 64Kb supposed to be a max cluster size on NTFS
	m_chunks(0),
	m_firstChunk(nullptr),
	m_lastChunk(nullptr)
{
	InitCalcClusterSize();
	if (AddChunk())
		m_initSucceeded = true;
}

CLogReader::~CLogReader()
{
	if (m_filter)
		free(m_filter);

	Chunk* toDelete = m_firstChunk;
	while (toDelete)
	{
		Chunk* p = toDelete;
		toDelete = toDelete->next;
		delete p;
	}

	Close();
}

// открытие файла, false - ошибка
bool CLogReader::Open(const char* fileName)
{
	// Init fails
	if (!m_initSucceeded)
		return false;

	// Already opened
	if (m_file != INVALID_HANDLE_VALUE)
		return false;

	m_file = ::CreateFileA(fileName, GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);

	// TODO:
	return false;
}

// закрытие файла
void CLogReader::Close()
{
	if (m_file != INVALID_HANDLE_VALUE)
		::CloseHandle(m_file);
	m_file = INVALID_HANDLE_VALUE;
}

// установка фильтра строк, false - ошибка
bool CLogReader::SetFilter(const char* filter)
{
	// TODO: multiple set

	// Init fails
	if (!m_initSucceeded)
		return false;

	if (!m_filter) // Already set. Assume should be set once
		return false;

	const size_t filterLen = ::strlen(filter);
	m_filter = (char*)malloc(filterLen); // Operator new works faster but I have no-exceptions requirement
	if (!m_filter) // No enough memory
		return false;

	if (::strcpy_s(m_filter, filterLen, filter))
	{
		free(m_filter);
		m_filter = nullptr;
		return false;
	}

	return true;
}

// запрос очередной найденной строки,
// buf - буфер, bufsize - максимальная длина
// false - конец файла или ошибка
bool CLogReader::GetNextLine(char* buf, const int bufsize)
{
	// Init fails
	if (!m_initSucceeded)
		return false;

	// File not yet ready
	if (m_file == INVALID_HANDLE_VALUE)
		return false;

	// Filter not yet set
	if (!m_filter)
		return false;

	return false;
}

// Take disk cluster size in advance of read performance
void CLogReader::InitCalcClusterSize()
{
	DWORD dwSectorsPerCluster;
	DWORD dwBytesPerSector;
	DWORD dwNumberOfFreeClusters;
	DWORD dwTotalNumberOfClusters;
	if (::GetDiskFreeSpace(NULL, &dwSectorsPerCluster, &dwBytesPerSector, &dwNumberOfFreeClusters, &dwTotalNumberOfClusters))
		m_clusterSize = dwSectorsPerCluster * dwBytesPerSector; // 64Kb is default if fails
}

// True if succeeded, false in error case
bool CLogReader::AddChunk()
{
	if (!m_lastChunk)
	{
		// Initialization
		m_firstChunk = new CLogReader::Chunk(m_clusterSize);
		m_lastChunk = m_firstChunk;
	}
	else
	{
		Chunk* newChunk = new CLogReader::Chunk(m_clusterSize);
		m_lastChunk->next = newChunk;
		m_lastChunk = newChunk;
	}

	return m_lastChunk->buffer;
}