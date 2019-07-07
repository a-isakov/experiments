#include "pch.h"
#include "CppUnitTest.h"
#include "..\\Solver.cpp"

using namespace Microsoft::VisualStudio::CppUnitTestFramework;

namespace UnitTest
{
	TEST_CLASS(UnitTest)
	{
	private:
		void checkOutPutNameComposerImpl(const std::string & _value, const std::string & _result)
		{
			Logger::WriteMessage(("Checking " + _value).c_str());
			Assert::AreEqual(composeOutputFileName(_value), _result);
			Logger::WriteMessage("Passed");
		}

		void checkFilterImpl(const std::string & _value, const std::string & _result)
		{
			Logger::WriteMessage(("Checking " + _value).c_str());
			Assert::AreEqual(filter(_value), _result);
			Logger::WriteMessage("Passed");
		}

		void checkTransformImpl(const std::string& _value, const std::string& _result)
		{
			Logger::WriteMessage(("Checking " + _value).c_str());
			Assert::AreEqual(transform(_value), _result);
			Logger::WriteMessage("Passed");
		}

	public:
		TEST_METHOD(checkOutPutNameComposer)
		{
			Logger::WriteMessage("TEST: checkOutPutNameComposer");
			checkOutPutNameComposerImpl("input", "input-processed");
			checkOutPutNameComposerImpl("in.txt", "in-processed.txt");
			checkOutPutNameComposerImpl("in.txt.txt", "in.txt-processed.txt");
			checkOutPutNameComposerImpl("", "-processed");
		}

		TEST_METHOD(checkFilter)
		{
			Logger::WriteMessage("TEST: checkFilter");
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
			checkFilterImpl("65ˆ", "65");
			checkFilterImpl("-1222‚FF", "-1222");
		}

		TEST_METHOD(checkTransform)
		{
			Logger::WriteMessage("TEST: checkTransform");
			checkTransformImpl("", "");
			checkTransformImpl(" ", "");
			checkTransformImpl("1", "1 : 1 1 1 1");
			checkTransformImpl("12 -12 2 9 0.1 65ˆ 121", "-12 0.1 2 9 12 65 121 : -12 121 197.1 28.1571");
			checkTransformImpl("12  -12 2 9 0.1 65ˆ 121", "-12 0.1 2 9 12 65 121 : -12 121 197.1 28.1571");
			checkTransformImpl("789 9 99 -678 -1222‚FF 0 122.67 345", "-1222 -678 0 9 99 122.67 345 789 : -1222 789 -535.33 -66.9162");
			checkTransformImpl("789 9 99 -678   -1222‚FF 0  122.67 345", "-1222 -678 0 9 99 122.67 345 789 : -1222 789 -535.33 -66.9162");
		}
	};
}
