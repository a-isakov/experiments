#pragma once

#include <string>
#include <queue>

std::string composeOutputFileName(const std::string& _in);
std::string filter(const std::string& _in);
std::string transform(const std::string& _in);
void readerThread(const std::string& _inputFileName, std::queue<std::string>& _processedStrings);
void writerThread();

class Solver
{
};
