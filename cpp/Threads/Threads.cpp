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

		Solver solver(argv[1]);

		std::thread reader(&Solver::readerThread, &solver);
		std::thread writer(&Solver::writerThread, &solver);

		reader.join();
		writer.join();

		std::cout << "See result of processing in " << solver.getOutFileName() << "\n";
	}
}
