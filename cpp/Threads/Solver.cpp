#include "Solver.h"

#include <iostream>
#include <fstream>
#include <thread>
#include <sstream>

std::string composeOutputFileName(const std::string& _in)
{
	std::string out = _in;
	size_t dotPos = out.rfind(".");
	if (dotPos == std::string::npos)
		out += "-processed";
	else
		out.insert(dotPos, "-processed");

	return out;
}

std::string filter(const std::string& _in)
{
	std::string out;
	bool isNegative = false;
	bool dotFound = false;
	for (std::string::const_reverse_iterator it = _in.crbegin(); it != _in.crend(); it++)
	{
		if (isdigit(*it) || (!dotFound && *it == '.'))
		{
			out.insert(out.cbegin(), *it);
			if (isNegative)
				isNegative = false;
			if (*it == '.')
				dotFound = true;
		}
		if (*it == '-')
			isNegative = true;
	}

	return isNegative && !out.empty() ? "-" + out : out;
}

std::string transform(const std::string& _in)
{
	std::istringstream in(_in);
	std::string str;
	std::priority_queue<double, std::vector<double>, std::greater<double>> pq;
	while (std::getline(in, str, ' '))
	{
		str = filter(str);
		//std::pair<double, std::string> item;
	}
	return "";
}

void readerThread(const std::string& _inputFileName, std::queue<std::string>& _processedStrings)
{
	std::ifstream inFile;
	try
	{
		//inFile.exceptions();
		inFile.open(_inputFileName);
		std::string str;
		while (std::getline(inFile, str))
		{
			_processedStrings.push(transform(str));
		}
	}
	catch (const std::ifstream::failure& e)
	{
		std::cout << "Exception occured while file opened: " << e.what() << "\n";
	}
}

void writerThread()
{
}
