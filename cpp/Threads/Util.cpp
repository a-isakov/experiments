#include "Util.h"
#include <sstream>
#include <queue>

std::string Util::composeOutputFileName(const std::string& _in)
{
	std::string out = _in;
	size_t dotPos = out.rfind(".");
	if (dotPos == std::string::npos)
		out += "-processed";
	else
		out.insert(dotPos, "-processed");

	return out;
}

std::string Util::filterNumber(const std::string& _in)
{
	std::string out;
	bool isNegative = false;
	bool dotFound = false;
	for (std::string::const_reverse_iterator it = _in.crbegin(); it != _in.crend(); it++)
	{
		unsigned char c(*it);
		if (isdigit(c) || (!dotFound && c == '.'))
		{
			out.insert(out.cbegin(), c);
			if (isNegative)
				isNegative = false;
			if (c == '.')
				dotFound = true;
		}
		if (c == '-')
			isNegative = true;
	}

	return isNegative && !out.empty() ? "-" + out : out;
}

typedef std::pair<double, std::string> doubleStringPair;

std::string Util::transform(const std::string& _in)
{
	std::istringstream in(_in);
	std::string str;

	auto cmp = [](doubleStringPair left, doubleStringPair right) { return left.first > right.first; };
	std::priority_queue<doubleStringPair, std::vector<doubleStringPair>, decltype(cmp)> pq(cmp);

	// Parse numbers and order them
	while (std::getline(in, str, ' '))
	{
		str = filterNumber(str);
		if (!str.empty())
		{
			doubleStringPair item(::atof(str.c_str()), str);
			pq.push(item);
		}
	}
	if (pq.empty())
		return "";

	// Do calc
	double sum = 0;
	size_t size = pq.size();
	std::string min = pq.top().second;
	std::string max;
	std::ostringstream result;
	while (!pq.empty())
	{
		sum += pq.top().first;
		result << pq.top().second << " ";

		if (pq.size() == 1) // Last one
			result << ": " << min << " " << pq.top().second << " " << sum << " " << sum / size;

		pq.pop();
	}


	return result.str();
}
