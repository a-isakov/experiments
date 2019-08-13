#include "LogReader.h"

// 64Kb supposed to be a max cluster size on NTFS
constexpr DWORD DEFAULT_CLUSTER_SIZE = 64 * 1024;

///////////////////////////////////////////////////////////////////////////////////////////
// Main class

CLogReader::CLogReader()
{
}

CLogReader::~CLogReader()
{
	Close();
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
	if (m_filter.Size()) // Already set. Assume should be set once however it is pretty easy to implement reset
		return false;

	const size_t filterLen = ::strlen(filter);
	m_filter.AppendBytes(filter, filterLen); // Copy filter

	// Collapse stars
	size_t ind = 0;
	for (size_t i = 0; i < filterLen; i++)
	{
		switch (filter[i])
		{
		case '*':
			// Collapse stars. It makes match a bit faster
			if (i && filter[i - 1] == '*')
				break;
		default:
			if (ind == i)
				ind++;
			else
				m_filter[ind++] = filter[i]; // Change only if multiple stars found
		}
	}
	m_filter[ind] = 0; // Finalize updated filter

	return true;
}

// запрос очередной найденной строки,
// buf - буфер, bufsize - максимальная длина
// false - конец файла или ошибка
bool CLogReader::GetNextLine(char* buf, const int bufsize)
{
	// Filter not yet set
	if (!m_filter.Size())
		return false;

	CLogLine logLine;
	while (m_fileHelper.GetLine(logLine)) // Read lines from the file
	{
		if (logLine.Matches(&m_filter[0])) // Check line against the filter
		{
			if (logLine.Size() < (size_t)bufsize) // Buffer is enough
				return !::memcpy_s(buf, bufsize, &logLine[0], logLine.Size() + 1);
			else // Cut the line with trailing "..." if buffer is small
			{
				logLine[bufsize - 1] = 0;
				logLine[bufsize - 2] = '.';
				logLine[bufsize - 3] = '.';
				logLine[bufsize - 4] = '.';
				return !::memcpy_s(buf, bufsize, &logLine[0], bufsize);
			}
		}
	}

	return false;
}

///////////////////////////////////////////////////////////////////////////////////////////
// CArray. Hand made dynamic array. Cannot reduce size because no need in this task

template <class T>
CLogReader::CArray<T>::CArray(const size_t capacity) : // capacity is a number of elements not bytes
	m_failed(false),
	m_size(0),
	m_array(nullptr)
{
	if (capacity && !Alloc(capacity)) // Reserve memory
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
CLogReader::CArray<T>& CLogReader::CArray<T>::operator=(CArray<T>&& rhv) noexcept
{
	m_failed = rhv.m_failed;
	m_size = rhv.m_size;
	m_capacity = rhv.m_capacity;
	m_array = rhv.m_array;

	rhv.m_size = 0;
	rhv.m_capacity = 0;
	rhv.m_array = nullptr;

	return *this;
}

template <class T>
CLogReader::CArray<T>::~CArray()
{
	Clear();
}

// Return number of elements in the array
template <class T>
size_t CLogReader::CArray<T>::Size()
{
	return m_size;
}

// Add element to array
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

	m_array[m_size++] = (T&&)item;
	return true;
}

// Add array of elements
template <class T>
bool CLogReader::CArray<T>::Append(const T* items, size_t count, bool keepTail)
{
	size_t remains = m_capacity - m_size;
	if (remains < count) // Need to change array capacity
	{
		size_t need = count - remains;
		if (!Alloc(m_capacity + need))
			return false;
		remains = m_capacity - m_size;
	}

	T tail = m_array[m_size - 1]; // Remember last element
	if (!::memcpy_s(&m_array[keepTail ? m_size - 1 : m_size], sizeof(T) * remains, items, sizeof(T) * count))
		m_size += count;
	else
		return false;
	if (keepTail) // Need to move last element for string operations where 0 should be at the end
		m_array[m_size - 1] = tail;

	return true;
}

// Random access operator. Unsafe
template <class T>
T& CLogReader::CArray<T>::operator[](const size_t i)
{
	return m_array[i];
}

// Allocate space for specified number of elements. Possible to change size when used as a buffer
template <class T>
bool CLogReader::CArray<T>::Alloc(const size_t capacity, const bool resize)
{
	if (m_failed)
		return false;

	if (capacity <= m_capacity) // Requests capacity is less than existing
		return true;

	// Create new bigger array and copy old one over
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

// Increase reserved size twice
template <class T>
bool CLogReader::CArray<T>::DoubleSize()
{
	if (m_failed)
		return false;

	return Alloc(m_capacity * 2);
}

// Cleanup array
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

///////////////////////////////////////////////////////////////////////////////////////////
// CLogLine. Originally designed for log lines only but used in multiple places

CLogReader::CLogLine::CLogLine() :
	m_str(0)
{
	m_str.Append(0); // Always store 0 as end of the line
}

//CLogReader::CLogLine::CLogLine(CLogLine const&& rhv) noexcept :
//	m_str((CArray<char> const&&)rhv.m_str)
//{
//}

// Copy string to the tail of this one
bool CLogReader::CLogLine::AppendBytes(const char* buf, const size_t size)
{
	return m_str.Append(buf, size, true);
}

// Length of the string without 0
size_t CLogReader::CLogLine::Size()
{
	// Buffer minus trailing zero
	return m_str.Size() - 1;
}

// Random access operator. Unsafe
char& CLogReader::CLogLine::operator[](const size_t i)
{
	return m_str[i];
}

// Cleanup the string
void CLogReader::CLogLine::Clear()
{
	m_str.Clear();
	m_str.Append(0); // Always store 0 as end of the line
}

// Verify if string matches filter criteria
bool CLogReader::CLogLine::Matches(const char* filter)
{
	if (!filter || !filter[0])
		return false;

	size_t fIndex = 0;
	size_t fRevIndex = -1;
	size_t lIndex = 0;
	size_t lRevIndex = -1;
	while (true)
	{
		if (filter[fIndex] == '*')
		{
			// Save reverse position but move filter position on
			fRevIndex = fIndex++;
			lRevIndex = lIndex;
		}
		else if (!m_str[lIndex]) // End of the line
		{
			return !filter[fIndex]; // Matches if filter also ends
		}
		else if (filter[fIndex] == '?' || m_str[lIndex] == filter[fIndex]) // Characted matches, move forward
		{
			fIndex++;
			lIndex++;
		}
		else if (!filter[fIndex]) // End of filter
		{
			// Try to revert position
			if (fRevIndex == -1)
				return false;
			fIndex = fRevIndex;
			lIndex++;
		}
		else if (lRevIndex == -1) // No reverse position for line
			return false;
		else
		{
			// Revert positions and move line position on
			lIndex = ++lRevIndex;
			fIndex = fRevIndex;
		}
	}
	return false;
}

///////////////////////////////////////////////////////////////////////////////////////////
// CFileHelper

CLogReader::CFileHelper::CFileHelper() :
	m_file(INVALID_HANDLE_VALUE), // This is a flag of opened/non-opened
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
		CalcClusterSize(fileName); // Try to check size of the cluster of the disk where file saved
		return m_buffer.Alloc(m_clusterSize, true);
	}

	return false;
}

// Close file if it has been opened. Optional because invoked from destructor
void CLogReader::CFileHelper::Close()
{
	if (m_file != INVALID_HANDLE_VALUE)
		::CloseHandle(m_file);
	m_file = INVALID_HANDLE_VALUE;
	m_buffer.Clear();
}

// Read line
bool CLogReader::CFileHelper::GetLine(CLogLine& logLine)
{
	logLine.Clear();
	while (!m_bytesInBuffer || (m_buffer[m_bufferIndex] != '\n' && m_buffer[m_bufferIndex] != '\r'))
	{
		if (!m_bytesInBuffer) // Buffer is empty
		{
			// Need to read data from file to buffer
			if (!ReadBlock())
				return false;
			if (!m_bytesInBuffer) // No more data in file
				break;
		}

		// Look for line break or end of buffer
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

			// Reset these values to enforce read one more portion from file to buffer
			m_bytesInBuffer = 0;
			m_bufferIndex = 0;
		}
	}

	if (m_bytesInBuffer)
	{
		// Move index to the beginning of the new line
		while ((m_buffer[m_bufferIndex] == '\n' || m_buffer[m_bufferIndex] == '\r') && m_bufferIndex < m_bytesInBuffer)
		{
			m_bufferIndex++;
		}
		if (m_bufferIndex == m_bytesInBuffer) // End of buffer
			ReadBlock(); // Need to read new block into buffer
	}

	if (!logLine.Size() && !m_bytesInBuffer) // Line is empty and no more data in file
		return false;

	return true;
}

// Returns root path value for cluster size calculation
// Returns nullptr if cannot recognize
// NOTE: Returned value should always be disposed by free function to prevent memory leak
char* CLogReader::CFileHelper::GetRootPath(const char* fileName)
{
	if (!fileName)
		return nullptr;

	const size_t fileNameLen = ::strlen(fileName);
	if (fileNameLen <= 3) // Cannot recognize disk from such a small path
		return nullptr;

	char* rootPath = nullptr;
	size_t trailPos = 0;
	if (fileName[1] == ':' && fileName[2] == '\\') // Drive is in the path
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
		rootPath = (char*)::malloc(trailPos + 1);
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

	return rootPath; // <- This value should be freed by invoker
}

// Take disk cluster size in advance of read performance. Current disk used if cannot recognize drive from the path
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

// Read block from file into buffer
bool CLogReader::CFileHelper::ReadBlock()
{
	if (!::ReadFile(m_file, &m_buffer[0], m_clusterSize, &m_bytesInBuffer, NULL))
		return false;
	m_bufferIndex = 0;
	return true;
}