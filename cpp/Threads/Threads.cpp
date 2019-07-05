#include <iostream>
#include <string>
#include <fstream>
#include <thread>
#include <queue>

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
			_processedStrings.push(str);
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

int main(int argc, char* argv[])
{
	if (argc == 1)
		std::cout << "File name is required as input argument\n";
	else if (argc > 2)
		std::cout << "Only one agrument is supported\n";
	else
	{
		std::string inputFileName(argv[1]);
		std::string outputFileName = composeOutputFileName(inputFileName);

		std::queue<std::string> processedStrings;

		std::thread reader(readerThread, inputFileName, std::ref(processedStrings));
		std::thread writer(writerThread);

		reader.join();
		writer.join();

		std::cout << "See result of processing in " << outputFileName << "\n";
	}
}
