#include "pch.h"
#include "CppUnitTest.h"
#include "..\\Solver.cpp"

using namespace Microsoft::VisualStudio::CppUnitTestFramework;

namespace UnitTest
{
	TEST_CLASS(UnitTest)
	{
	public:
		void checkFilterImpl(const std::string& _value, const std::string& _result)
		{
			Logger::WriteMessage(("Checking " + _value).c_str());
			Assert::AreEqual(filter(_value), _result);
			Logger::WriteMessage("Passed");
		}
		TEST_METHOD(checkFilter)
		{
			checkFilterImpl("-1", "-1");
			checkFilterImpl("12", "12");
			checkFilterImpl("-1-", "-1");
			checkFilterImpl("--1", "-1");
			checkFilterImpl("-1-2", "-12");
			checkFilterImpl("3-1", "31");
			checkFilterImpl("-1.2", "-1.2");
			checkFilterImpl("-1.2.3", "-12.3");
			checkFilterImpl("1.-2.3", "12.3");
			checkFilterImpl("1.-ab2.3", "12.3");
			checkFilterImpl("-1.-2.3", "-12.3");
			checkFilterImpl("a", "");
			checkFilterImpl("-a", "");
			checkFilterImpl("--", "");
		}
	};
}
