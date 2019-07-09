#pragma once

#include <string>
#include <queue>

class Solver
{
public:
	Solver(const std::string& _inFile);

	void readerThread();
	void writerThread();

	std::string getOutFileName();

protected:
	std::string inFileName;
	std::string outFileName;
	std::queue<std::string> processedStrings;

	//std::condition_variable 
};
