#include "LogReader.h"

// 64Kb supposed to be a max cluster size on NTFS
constexpr DWORD DEFAULT_CLUSTER_SIZE = 64 * 1024;

////////////////////////////////////
// Main class

CLogReader::CLogReader() :
	m_rules(0)
	//m_filter(nullptr),
	//m_firstRule(nullptr)
{
}

CLogReader::~CLogReader()
{
	//if (m_filter)
	//	sfree(m_filter);

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
	//if (!m_firstRule) // Already set. Assume should be set once
	//	return false;

	const size_t filterLen = ::strlen(filter);

	// Parse rules
	//m_firstRule = new SRule();
	//if (!m_firstRule->AddChar(filter[0]))
	//{
	//	CleanRules();
	//	return false;
	//}
	//SRule* currentRule = m_firstRule;
	//for (size_t i = 1; i < filterLen; i++)
	//{
	//	if (filter[i] == '*')
	//	{
	//		if (currentRule->pattern[0] == '*')
	//			continue; // Compress stars
	//		else
	//		{
	//			if (!currentRule->AddRule(filter[i]))
	//			{
	//				CleanRules();
	//				return false;
	//			}
	//		}
	//	}
	//	else if (filter[i] == '?')
	//	{
	//		if (!currentRule->AddRule(filter[i]))
	//		{
	//			CleanRules();
	//			return false;
	//		}
	//	}
	//	else
	//	{
	//		if (currentRule->pattern[0] == '?' || currentRule->pattern[0] == '*')
	//		{
	//			if (!currentRule->AddRule(filter[i]))
	//			{
	//				CleanRules();
	//				return false;
	//			}
	//			else if (!currentRule->AddChar(filter[i]))
	//			{
	//				CleanRules();
	//				return false;
	//			}
	//		}
	//	}
	//}

	return true;
}

void CLogReader::CleanRules()
{
	//while (m_firstRule)
	//{
	//	SRule* p = m_firstRule->next;
	//	delete m_firstRule;
	//	m_firstRule = p;
	//}
}

// запрос очередной найденной строки,
// buf - буфер, bufsize - максимальная длина
// false - конец файла или ошибка
bool CLogReader::GetNextLine(char* buf, const int bufsize)
{
	// Filter not yet set
	//if (!m_firstRule)
	//	return false;

	CLogLine logLine;
	bool b = m_fileHelper.GetLine(logLine);
	b = m_fileHelper.GetLine(logLine);
	b = m_fileHelper.GetLine(logLine);
	b = m_fileHelper.GetLine(logLine);
	b = m_fileHelper.GetLine(logLine);

	//if (logLine.Size() < (size_t)bufsize) // Buffer is enough
	//	return !::memcpy_s(buf, bufsize, &logLine[0], logLine.Size() + 1);
	//else // Cut the line
	//{
	//	logLine[bufsize - 1] = 0;
	//	logLine[bufsize - 2] = '.';
	//	logLine[bufsize - 3] = '.';
	//	logLine[bufsize - 4] = '.';
	//	return !::memcpy_s(buf, bufsize, &logLine[0], bufsize);
	//}

	return false;
}

////////////////////////////////////
// CArray
template <class T>
CLogReader::CArray<T>::CArray(const size_t capacity) :
	m_failed(false),
	m_size(0),
	m_array(nullptr)
{
	if (capacity && !Alloc(capacity))
		m_failed = true;
	else
		m_capacity = capacity;
}

template <class T>
CLogReader::CArray<T>::CArray(CArray<T> const&& rhv) noexcept :
	m_failed(rhv.m_failed),
	m_size(rhv.m_size),
	m_capacity(rhv.m_capacity),
	m_array(rhv.m_array)
{
	m_size = 0;
	m_capacity = 0;
	m_array = nullptr;
}

template <class T>
CLogReader::CArray<T>::~CArray()
{
	Clear();
}

template <class T>
size_t CLogReader::CArray<T>::Size()
{
	return m_size;
}

template <class T>
bool CLogReader::CArray<T>::Append(T&& item)
{
	if (m_failed)
		return false;

	if (!m_capacity && !Alloc())
		return false;

	if (m_size == m_capacity && !DoubleSize())
	{
		m_failed = true;
		return false;
	}

	m_array[m_size++] = item;
	return true;
}

template <class T>
bool CLogReader::CArray<T>::Append(T* items, size_t count, bool keepTail)
{
	size_t remains = m_capacity - m_size;
	if (remains < count) // Need to change array capacity
	{
		size_t need = count - remains;
		if (!Alloc(m_capacity + need))
			return false;
		remains = m_capacity - m_size;
	}

	T tail = m_array[m_size - 1];
	if (!::memcpy_s(&m_array[keepTail ? m_size - 1 : m_size], sizeof(T) * remains, items, sizeof(T) * count))
		m_size += count;
	else
		return false;
	if (keepTail)
		m_array[m_size - 1] = tail;

	return true;
}

template <class T>
T& CLogReader::CArray<T>::operator[](const size_t i)
{
	//if (m_failed || i >= m_size)
	//	return nullptr;
	return m_array[i];
}

template <class T>
bool CLogReader::CArray<T>::Alloc(const size_t capacity, const bool resize)
{
	if (m_failed)
		return false;

	if (capacity <= m_capacity)
		return true;

	size_t bytesNeed = sizeof(T) * capacity;
	T* newArray = (T*)::malloc(bytesNeed);
	if (!newArray)
	{
		m_failed = true;
		return false;
	}

	if (m_array)
	{
		if (::memcpy_s(newArray, bytesNeed, m_array, sizeof(T) * m_capacity))
		{
			m_failed = true;
			::free(newArray);
			return false;
		}

		T* toDelete = m_array;
		::free(toDelete);
	}
	m_array = newArray;
	m_capacity = capacity;

	if (resize)
		m_size = m_capacity;

	return true;
}

template <class T>
bool CLogReader::CArray<T>::DoubleSize()
{
	if (m_failed)
		return false;

	return Alloc(m_capacity * 2);
}

template <class T>
void CLogReader::CArray<T>::Clear()
{
	if (!m_array)
		return;
	::free(m_array);
	m_array = nullptr;
	m_size = 0;
	m_capacity = 0;
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
// CLogLine

CLogReader::CLogLine::CLogLine() :
	m_str(0)
{
	m_str.Append(0);
}

CLogReader::CLogLine::CLogLine(CLogLine const&& rhv) noexcept :
	m_str((CArray<char> const&&)rhv.m_str)
{
}

bool CLogReader::CLogLine::AppendBytes(char* buf, const size_t size)
{
	return m_str.Append(buf, size, true);
}

size_t CLogReader::CLogLine::Size()
{
	// Buffer minus trailing zero
	return m_str.Size() - 1;
}

char& CLogReader::CLogLine::operator[](const size_t i)
{
	return m_str[i];
}

void CLogReader::CLogLine::Clear()
{
	m_str.Clear();
}

////////////////////////////////////
// CFileHelper

CLogReader::CFileHelper::CFileHelper() :
	m_file(INVALID_HANDLE_VALUE),
	m_clusterSize(DEFAULT_CLUSTER_SIZE),
	m_bytesInBuffer(0),
	m_bufferIndex(0),
	m_buffer(0)
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
		return m_buffer.Alloc(m_clusterSize, true);
	}

	return false;
}

void CLogReader::CFileHelper::Close()
{
	if (m_file != INVALID_HANDLE_VALUE)
		::CloseHandle(m_file);
	m_file = INVALID_HANDLE_VALUE;
	m_buffer.Clear();
}

bool CLogReader::CFileHelper::GetLine(CLogLine& logLine)
{
	logLine.Clear();
	while (!m_bytesInBuffer || (m_buffer[m_bufferIndex] != '\n' && m_buffer[m_bufferIndex] != '\r'))
	{
		if (!m_bytesInBuffer) // Buffer is empty
		{
			if (!ReadBlock())
				return false;
			if (!m_bytesInBuffer) // No more data in file
				break;
		}

		// Look for line tail or end of buffer
		DWORD pos = m_bufferIndex;
		while (m_buffer[pos] != '\n' && m_buffer[pos] != '\r' && pos < m_bytesInBuffer)
		{
			pos++;
		}

		if (pos != m_bytesInBuffer) // End of line
		{
			if (!logLine.AppendBytes(&m_buffer[m_bufferIndex], pos - m_bufferIndex))
				return false;

			m_bufferIndex = pos;
		}
		else // End of buffer
		{
			if (!logLine.AppendBytes(&m_buffer[m_bufferIndex], pos - m_bufferIndex))
				return false;

			m_bytesInBuffer = 0;
			m_bufferIndex = 0;
		}
	}

	if (m_bytesInBuffer)
	{
		// Track index to the beginning of the new line
		while ((m_buffer[m_bufferIndex] == '\n' || m_buffer[m_bufferIndex] == '\r') && m_bufferIndex < m_bytesInBuffer)
		{
			m_bufferIndex++;
		}
		if (m_bufferIndex == m_bytesInBuffer) // End of buffer
			ReadBlock();
	}

	if (!logLine.Size() && !m_bytesInBuffer) // Line is empty and no more data in file
		return false;

	return true;
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
	size_t trailPos = 0;
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
		rootPath = (char*)::malloc(trailPos + 1); // Operator new works faster but I have no-exceptions requirement
		if (rootPath)
		{
			// Try to copy substring of the path
			if (!::memcpy_s(rootPath, trailPos, fileName, trailPos))
				rootPath[trailPos] = 0;
			else
			{
				::free(rootPath);
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
		::free(rootPath);
}

bool CLogReader::CFileHelper::ReadBlock()
{
	if (!::ReadFile(m_file, &m_buffer[0], m_clusterSize, &m_bytesInBuffer, NULL))
		return false;
	m_bufferIndex = 0;
	return true;
}