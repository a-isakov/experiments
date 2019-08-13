// LogReaderSample.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <stdio.h>
#include "LogReader.h"
#include "TestDef.h"

#ifdef TESTROOTPATH
void testRootPath();
#endif
#ifdef TESTARRAY
void testArray();
#endif
#ifdef TESTLOGLINE
void testLogString();
#endif
#ifdef TESTMATCH
void testMatch();
#endif


int main(int argc, char* argv[])
{
	if (argc != 3)
	{
		::printf("Two params expected: LogReaderSample.exe <log-file-name> <mask>\n");
		return 0;
	}

	constexpr size_t size = 60;
	char buffer[size];
	CLogReader logReader;
	if (!logReader.SetFilter(argv[2]))
	{
		::printf("Failed to set specified mask: %s\n", argv[2]);
		return 0;
	}
	if (!logReader.Open(argv[1]))
	{
		::printf("Failed to open specified file: %s\n", argv[1]);
		return 0;
	}

	bool foundOnce = false;
	while (logReader.GetNextLine(buffer, size))
	{
		if (!foundOnce)
		{
			::printf("--- Matches found:\n\n");
			foundOnce = true;
		}
		::printf("%s\n", buffer);
	}
	::printf(foundOnce ? "\n--- Search completed\n" : "Nothing found\n");

	logReader.Close();
#ifdef TESTROOTPATH
	testRootPath();
#endif
#ifdef TESTARRAY
	testArray();
#endif
#ifdef TESTLOGLINE
	testLogString();
#endif
#ifdef TESTMATCH
	testMatch();
#endif
#ifdef TESTE2E
	char buf[2048];
	CLogReader logReader;
	logReader.SetFilter("a***?tst?a");
	logReader.Open("D:\\dev\\experiments\\.gitignore");
	logReader.GetNextLine(buf, 2048);
	logReader.Close();
#endif
}

#ifdef TESTROOTPATH
void testRootPath()
{
	// Don't care of memory leaks
	char* test = CLogReader::testRootPath("C:\\");
	if (!test)
		::printf("Test 1 passed\n");
	else
		::printf("Test 1 failed\n");

	test = CLogReader::testRootPath("C:\\a");
	if (!test)
		::printf("Test 2 failed\n");
	else if (::strcmp(test, "C:\\"))
		::printf("Test 2 failed equality\n");
	else
		::printf("Test 2 passed\n");

	test = CLogReader::testRootPath(nullptr);
	if (!test)
		::printf("Test 3 passed\n");
	else
		::printf("Test 3 failed\n");

	test = CLogReader::testRootPath("a");
	if (!test)
		::printf("Test 4 passed\n");
	else
		::printf("Test 4 failed\n");

	test = CLogReader::testRootPath("\\\\a\\");
	if (!test)
		::printf("Test 5 passed\n");
	else
		::printf("Test 5 failed\n");

	test = CLogReader::testRootPath("\\\\a\\b");
	if (!test)
		::printf("Test 6 passed\n");
	else
		::printf("Test 6 failed\n");

	test = CLogReader::testRootPath("\\\\a\\b\\");
	if (!test)
		::printf("Test 7 passed\n");
	else
		::printf("Test 7 failed\n");

	test = CLogReader::testRootPath("\\\\a\\\\");
	if (!test)
		::printf("Test 8 passed\n");
	else
		::printf("Test 8 failed\n");

	test = CLogReader::testRootPath("\\\\a\\b\\c");
	if (!test)
		::printf("Test 9 failed\n");
	else if (::strcmp(test, "\\\\a\\b\\"))
		::printf("Test 9 failed equality\n");
	else
		::printf("Test 9 passed\n");

	test = CLogReader::testRootPath("\\\\abc\\def\\gh");
	if (!test)
		::printf("Test 10 failed\n");
	else if (::strcmp(test, "\\\\abc\\def\\"))
		::printf("Test 10 failed equality\n");
	else
		::printf("Test 10 passed\n");
}
#endif

#ifdef TESTARRAY
void testArray()
{
	CLogReader::CArray<char> e(0);
	if (e.Size())
		::printf("Test 11 failed\n");
	else
		::printf("Test 11 passed\n");

	CLogReader::CArray<char> a(3);
	if (a.Size())
		::printf("Test 12 failed\n");
	else
		::printf("Test 12 passed\n");

	char b[]{ 't','1',0 };
	a.Append(b, 3);
	if (a.Size() != 3)
		::printf("Test 13 failed\n");
	else
		::printf("Test 13 passed\n");

	if (::strcmp(&a[0], "t1"))
		::printf("Test 14 failed equality\n");
	else
		::printf("Test 14 passed\n");

	a.Append(b, 3);
	if (a.Size() != 6)
		::printf("Test 15 failed\n");
	else
		::printf("Test 15 passed\n");

	CLogReader::CArray<char> p(0);
	p.Append('a');
	p.Append('b');
	p.Append(0);

	if (p.Size() != 3)
		::printf("Test 16 failed\n");
	else if (::strcmp(&p[0], "ab"))
		::printf("Test 16 failed equality\n");
	else
		::printf("Test 16 passed\n");
}
#endif

#ifdef TESTLOGLINE
void testLogString()
{
	CLogReader::CLogLine l;
	if (l.m_str.Size() != 1)
		::printf("Test 17 failed\n");
	else
		::printf("Test 17 passed\n");

	if (l.m_str[0] != 0)
		::printf("Test 18 failed\n");
	else
		::printf("Test 18 passed\n");

	char b[]{ 't','1' };
	if (!l.AppendBytes(b, 2))
		::printf("Test 19 failed\n");
	else if (::strcmp(&l.m_str[0], "t1"))
		::printf("Test 19 failed equality\n");
	else
		::printf("Test 19 passed\n");

	if (!l.AppendBytes(b, 2))
		::printf("Test 20 failed\n");
	else if (::strcmp(&l.m_str[0], "t1t1"))
		::printf("Test 20 failed equality\n");
	else
		::printf("Test 20 passed\n");

	if (!l.AppendBytes(b, 2))
		::printf("Test 21 failed\n");
	else if (::strcmp(&l.m_str[0], "t1t1t1"))
		::printf("Test 21 failed equality\n");
	else
		::printf("Test 21 passed\n");
}
#endif

#ifdef TESTMATCH
void testMatch()
{
	CLogReader::CLogLine logLine;
	logLine.AppendBytes("one will be", 11);
	if (!logLine.Matches(""))
		::printf("Test 22 passed\n");
	else
		::printf("Test 22 failed\n");

	if (logLine.Matches("*"))
		::printf("Test 23 passed\n");
	else
		::printf("Test 23 failed\n");

	if (logLine.Matches("*?will*?"))
		::printf("Test 24 passed\n");
	else
		::printf("Test 24 failed\n");

	if (logLine.Matches("*be"))
		::printf("Test 25 passed\n");
	else
		::printf("Test 25 failed\n");

	if (!logLine.Matches("be"))
		::printf("Test 26 passed\n");
	else
		::printf("Test 26 failed\n");

	if (logLine.Matches("on*"))
		::printf("Test 27 passed\n");
	else
		::printf("Test 27 failed\n");

	if (logLine.Matches("?n*"))
		::printf("Test 28 passed\n");
	else
		::printf("Test 28 failed\n");

	if (logLine.Matches("???????????"))
		::printf("Test 29 passed\n");
	else
		::printf("Test 29 failed\n");

	if (!logLine.Matches("??????????"))
		::printf("Test 30 passed\n");
	else
		::printf("Test 30 failed\n");

	if (!logLine.Matches("????????????"))
		::printf("Test 31 passed\n");
	else
		::printf("Test 31 failed\n");

	if (!logLine.Matches("?"))
		::printf("Test 32 passed\n");
	else
		::printf("Test 32 failed\n");

	if (!logLine.Matches("*1*"))
		::printf("Test 33 passed\n");
	else
		::printf("Test 33 failed\n");

	if (!logLine.Matches("one"))
		::printf("Test 34 passed\n");
	else
		::printf("Test 34 failed\n");

	if (logLine.Matches("one*********************be"))
		::printf("Test 35 passed\n");
	else
		::printf("Test 35 failed\n");
}
#endif
