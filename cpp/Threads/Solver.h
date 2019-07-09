#pragma once

#include <string>
#include <queue>

class Solver
{
public:
	Solver(const std::string& _inFile);

protected:
	std::string inFileName;
	std::queue<std::string> processedStrings;

protected:
	void readerThread();
	void writerThread(const std::string& _outputFileName);
};
