#include "Solver.h"

#include <iostream>
#include <fstream>
#include <sstream>
#include "Util.h"

Solver::Solver(const std::string& _inFile) :
	inFileName(_inFile),
	outFileName(Util::composeOutputFileName(_inFile))
{
	writerExitFuture = writerExit.get_future();
}

void Solver::readerThread()
{
	std::ifstream inFile;
	try
	{
		bool writerNotified = false;
		//inFile.exceptions();
		inFile.open(inFileName);
		std::string str;
		while (std::getline(inFile, str))
		{
			std::unique_lock<std::mutex> continerLock(containerMutex);
			processedStrings.push(Util::transform(str));
			if (!writerNotified)
			{
				writerNotified = true;
				writerStartCond.notify_all();
			}
		}
	}
	catch (const std::ifstream::failure& e)
	{
		std::unique_lock<std::mutex> lock(coutMutex);
		std::cout << "Exception occured while input file opened: " << e.what() << "\n";
	}

	writerExit.set_value();
}

void Solver::writerThread()
{
	std::unique_lock<std::mutex> lockStart(writerStartMutex);
	writerStartCond.wait(lockStart);
	std::ofstream outFile;
	try
	{
		outFile.open(outFileName);
		while (writerExitFuture.wait_for(std::chrono::milliseconds(1)) == std::future_status::timeout || !processedStrings.empty())
		{
			while (!processedStrings.empty())
			{
				std::unique_lock<std::mutex> continerLock(containerMutex);
				const std::string& str = processedStrings.front();
				outFile << str << "\n";
				processedStrings.pop();
			}
		}
	}
	catch (const std::ofstream::failure& e)
	{
		std::unique_lock<std::mutex> lock(coutMutex);
		std::cout << "Exception occured while output file opened: " << e.what() << "\n";
	}
}

std::string Solver::getOutFileName()
{
	return outFileName;
}