// LogReaderSample.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <stdio.h>
#include "LogReader.h"
#include "TestDef.h"

int main()
{
	char buf[2048];
	CLogReader logReader;
	logReader.SetFilter("*");
	logReader.Open("C:\\Intel\\Logs\\IntelGFXCoin.log");
	logReader.GetNextLine(buf, 2048);
	logReader.Close();
#ifdef TESTROOTPATH
	// Run tests >>>
	testRootPath();
	// Run tests <<<
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
