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


int main()
{
#ifdef TESTROOTPATH
	testRootPath();
#endif
#ifdef TESTARRAY
	testArray();
#endif
#ifdef TESTLOGLINE
	testLogString();
#endif
#ifdef TESTE2E
	char buf[2048];
	CLogReader logReader;
	logReader.SetFilter("*");
	logReader.Open("C:\\dev\\experiments\\.gitignore");
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