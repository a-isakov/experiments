#include <iostream>
//#include <string>
#include <thread>
//#include <queue>

#include "Solver.h"

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
