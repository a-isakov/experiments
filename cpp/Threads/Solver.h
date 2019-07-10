#pragma once

#include <string>
#include <queue>
#include <thread>
#include <condition_variable>
#include <future>
#include <chrono>

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

	std::mutex coutMutex;
	std::mutex containerMutex;
	std::mutex writerStartMutex;
	std::condition_variable writerStartCond;

	std::promise<void> writerExit;
	std::future<void> writerExitFuture;
};
