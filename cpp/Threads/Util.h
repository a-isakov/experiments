#pragma once

#include <string>

class Util
{
public:
	static std::string composeOutputFileName(const std::string& _in);
	static std::string filterNumber(const std::string& _in);
	static std::string transform(const std::string& _in);
};
