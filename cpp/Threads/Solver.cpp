#include "Solver.h"

#include <iostream>
#include <fstream>
#include <thread>
#include <sstream>
#include <condition_variable>
#include "Util.h"

Solver::Solver(const std::string& _inFile) :
	inFileName(_inFile),
	outFileName(Util::composeOutputFileName(_inFile))
{
}

void Solver::readerThread()
{
	std::ifstream inFile;
	try
	{
		//inFile.exceptions();
		inFile.open(inFileName);
		std::string str;
		while (std::getline(inFile, str))
		{
			processedStrings.push(Util::transform(str));
		}
	}
	catch (const std::ifstream::failure& e)
	{
		std::cout << "Exception occured while input file opened: " << e.what() << "\n";
	}
}

void Solver::writerThread()
{
	std::ofstream outFile;
	try
	{
		outFile.open(outFileName);
		while (!processedStrings.empty())
		{
			const std::string& str = processedStrings.front();
			processedStrings.pop();
		}
	}
	catch (const std::ofstream::failure& e)
	{
		std::cout << "Exception occured while output file opened: " << e.what() << "\n";
	}
}

std::string Solver::getOutFileName()
{
	return outFileName;
}