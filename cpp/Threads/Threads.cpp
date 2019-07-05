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
		std::cout << (filter("-1") == "-1" ? "-1 passed" : "-1 FAILED") << "\n";
		std::cout << (filter("1") == "1" ? "1 passed" : "1 FAILED") << "\n";
		std::cout << (filter("--1") == "-1" ? "--1 passed" : "--1 FAILED") << "\n";
		std::cout << (filter("-1-2") == "-12" ? "-1-2 passed" : "-1-2 FAILED") << "\n";
		std::cout << (filter("1.2") == "1.2" ? "1.2 passed" : "1.2 FAILED") << "\n";
		std::cout << (filter("1.2.3") == "12.3" ? "1.2.3 passed" : "1.2.3 FAILED") << "\n";
		std::cout << "\n";
		//std::string inputFileName(argv[1]);
		//std::string outputFileName = composeOutputFileName(inputFileName);

		//std::queue<std::string> processedStrings;

		//std::thread reader(readerThread, inputFileName, std::ref(processedStrings));
		//std::thread writer(writerThread);

		//reader.join();
		//writer.join();

		//std::cout << "See result of processing in " << outputFileName << "\n";
	}
}
