#include "LogReader.h"

// 64Kb supposed to be a max cluster size on NTFS
constexpr DWORD DEFAULT_CLUSTER_SIZE = 64 * 1024;

////////////////////////////////////
// Main class

CLogReader::CLogReader() :
	//m_filter(nullptr),
	m_firstRule(nullptr)
{
}

CLogReader::~CLogReader()
{
	//if (m_filter)
	//	free(m_filter);

	CleanRules();
	m_fileHelper.Close();
}

// открытие файла, false - ошибка
bool CLogReader::Open(const char* fileName)
{
	return m_fileHelper.Open(fileName);
}

// закрытие файла
void CLogReader::Close()
{
	m_fileHelper.Close();
}

// установка фильтра строк, false - ошибка
bool CLogReader::SetFilter(const char* filter)
{
	if (!m_firstRule) // Already set. Assume should be set once
		return false;

	const size_t filterLen = ::strlen(filter);

	// Parse rules
	m_firstRule = new SRule();
	if (!m_firstRule->AddChar(filter[0]))
	{
		CleanRules();
		return false;
	}
	SRule* currentRule = m_firstRule;
	for (size_t i = 1; i < filterLen; i++)
	{
		if (filter[i] == '*')
		{
			if (currentRule->pattern[0] == '*')
				continue; // Compress stars
			else
			{
				if (!currentRule->AddRule(filter[i]))
				{
					CleanRules();
					return false;
				}
			}
		}
		else if (filter[i] == '?')
		{
			if (!currentRule->AddRule(filter[i]))
			{
				CleanRules();
				return false;
			}
		}
		else
		{
			if (currentRule->pattern[0] == '?' || currentRule->pattern[0] == '*')
			{
				if (!currentRule->AddRule(filter[i]))
				{
					CleanRules();
					return false;
				}
				else if (!currentRule->AddChar(filter[i]))
				{
					CleanRules();
					return false;
				}
			}
		}
	}

	return true;
}

void CLogReader::CleanRules()
{
	while (m_firstRule)
	{
		SRule* p = m_firstRule->next;
		delete m_firstRule;
		m_firstRule = p;
	}
}

// запрос очередной найденной строки,
// buf - буфер, bufsize - максимальная длина
// false - конец файла или ошибка
bool CLogReader::GetNextLine(char* buf, const int bufsize)
{
	// Filter not yet set
	if (!m_firstRule)
		return false;

	char buff[2048];
	m_fileHelper.GetLine(buff, 2048);

	return false;
}

////////////////////////////////////
// SRule
CLogReader::SRule::~SRule()
{
	if (pattern)
		::free(pattern);
}

bool CLogReader::SRule::AddChar(char c)
{
	if (!pattern)
	{
		pattern = (char*)::malloc(2);
		if (!pattern)
			return false;
		else
		{
			pattern[0] = c;
			pattern[1] = 0;
		}
	}
	else
	{
		const size_t size = sizeof(pattern);
		char* newPattern = (char*)::malloc(size + 1);
		if (!newPattern)
			return false;
		else
		{
			if (::memcpy_s(newPattern, size + 1, pattern, size))
			{
				::free(newPattern);
				return false;
			}
			else
			{
				newPattern[size - 1] = c;
				newPattern[size] = 0;
				::free(pattern);
				pattern = newPattern;
			}
		}
	}
	return true;
}

bool CLogReader::SRule::AddRule(char c)
{
	SRule* newRule = new SRule();
	if (!newRule->AddChar(c))
	{
		delete newRule;
		return false;
	}
	next = newRule;
	return true;
}

////////////////////////////////////
// CFileHelper

CLogReader::CFileHelper::CFileHelper() :
	m_file(INVALID_HANDLE_VALUE),
	m_clusterSize(DEFAULT_CLUSTER_SIZE),
	m_firstChunk(nullptr),
	m_lastChunk(nullptr),
	m_currentChunk(nullptr),
	m_chunkPos(0)
{
}

CLogReader::CFileHelper::~CFileHelper()
{
	Close();
}

bool CLogReader::CFileHelper::Open(const char* fileName)
{
	if (!fileName)
		return false;

	// Already opened
	if (m_file != INVALID_HANDLE_VALUE)
		return false;

	m_file = ::CreateFileA(fileName, GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
	if (m_file != INVALID_HANDLE_VALUE)
	{
		CalcClusterSize(fileName);
		return true;
	}

	return false;
}

void CLogReader::CFileHelper::Close()
{
	if (m_file != INVALID_HANDLE_VALUE)
		::CloseHandle(m_file);
	m_file = INVALID_HANDLE_VALUE;

	CleanChunks();
}

bool CLogReader::CFileHelper::GetLine(const char* buf, const int bufsize)
{
	if (!m_currentChunk)
	{
		if (!AddChunk())
			return false;
		m_currentChunk = m_firstChunk;
	}

	if (!m_currentChunk->bytes)
	{
		DWORD bytesRead = 0;
		if (::ReadFile(m_file, m_currentChunk->buffer, m_clusterSize, &bytesRead, NULL))
			m_currentChunk->bytes = bytesRead;
		else
			return false;
		if (!m_currentChunk->bytes)
			return false;
	}

	char* pos = (char*)::memchr(m_currentChunk->buffer, '\n', m_currentChunk->bytes);
	// TODO:

	return false;
}

void CLogReader::CFileHelper::CleanChunks()
{
	while (m_firstChunk)
	{
		SChunk* p = m_firstChunk->next;
		delete m_firstChunk;
		m_firstChunk = p;
	}

	m_firstChunk = nullptr;
	m_lastChunk = nullptr;
}

// True if succeeded, false in error case
bool CLogReader::CFileHelper::AddChunk()
{
	if (!m_lastChunk)
	{
		// Initialization
		m_firstChunk = new CLogReader::CFileHelper::SChunk(m_clusterSize, 0); // Struct is pretty small, operator new is safe
		m_lastChunk = m_firstChunk;
	}
	else
	{
		SChunk* newChunk = new CLogReader::CFileHelper::SChunk(m_clusterSize, m_lastChunk->i + 1); // Struct is pretty small, operator new is safe
		m_lastChunk->next = newChunk;
		m_lastChunk = newChunk;
	}

	return m_lastChunk->buffer;
}

// Returns root path value for cluster size calculation
// Returns nullptr if cannot recognize
// Returned value should be disposed by free function
char* CLogReader::CFileHelper::GetRootPath(const char* fileName)
{
	if (!fileName)
		return nullptr;

	const size_t fileNameLen = ::strlen(fileName);
	if (fileNameLen <= 3)
		return nullptr;

	char* rootPath = nullptr;
	int trailPos = 0;
	if (fileName[1] == ':' && fileName[2] == '\\') // Drive in the path
		trailPos = 2;
	else if (fileName[0] == '\\' && fileName[1] == '\\' && fileName[2] != '\\') // Check if it's UNC
	{
		size_t pos = 3; // First 3 already checked
		int slashCount = 0;
		while (slashCount < 2 && pos < fileNameLen)
		{
			if (fileName[pos++] == '\\')
				slashCount++;
		}
		if (slashCount == 2 && fileName[pos - 2] != '\\' && pos != fileNameLen) // Should not be last two slashes and last char should not be a slash
			trailPos = pos - 1;
	}
	if (trailPos)
	{
		trailPos++;
		rootPath = (char*)malloc(trailPos + 1); // Operator new works faster but I have no-exceptions requirement
		if (rootPath)
		{
			// Try to copy substring of the path
			if (!::memcpy_s(rootPath, trailPos, fileName, trailPos))
				rootPath[trailPos] = 0;
			else
			{
				free(rootPath);
				rootPath = nullptr;
			}
		}
	}

	return rootPath;
}

// Take disk cluster size in advance of read performance
void CLogReader::CFileHelper::CalcClusterSize(const char* fileName)
{
	char* rootPath = GetRootPath(fileName);

	DWORD sectorsPerCluster;
	DWORD bytesPerSector;
	DWORD numberOfFreeClusters;
	DWORD totalNumberOfClusters;
	if (::GetDiskFreeSpaceA((rootPath ? rootPath : NULL), &sectorsPerCluster, &bytesPerSector, &numberOfFreeClusters, &totalNumberOfClusters))
		m_clusterSize = sectorsPerCluster * bytesPerSector;
	else
		m_clusterSize = DEFAULT_CLUSTER_SIZE;

	if (rootPath)
		free(rootPath);
}
