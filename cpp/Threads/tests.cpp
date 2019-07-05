#include "CppUnitTest.h"
//#include "Solver.h"

using namespace Microsoft::VisualStudio::CppUnitTestFramework;

BEGIN_TEST_MODULE_ATTRIBUTE()
TEST_MODULE_ATTRIBUTE(L"Date", L"2019/7/5")
END_TEST_MODULE_ATTRIBUTE()

TEST_MODULE_INITIALIZE(ModuleInitialize)
{}

TEST_MODULE_CLEANUP(ModuleCleanup)
{}

TEST_CLASS(tests)
{
public:
	TEST_CLASS_INITIALIZE(ClassInitialize)
	{}

	TEST_CLASS_CLEANUP(ClassCleanup)
	{}

	BEGIN_TEST_METHOD_ATTRIBUTE(checkFilter)
		TEST_OWNER(L"AI")
		TEST_PRIORITY(1)
		TEST_METHOD_ATTRIBUTE(L"MyTrait", L"1")
	END_TEST_METHOD_ATTRIBUTE()

	TEST_METHOD(checkFilter)
	{
		//std::string s = filter("-1");
		//Assert::AreEqual(s, std::string("-1"));
		//Logger::WriteMessage("In checkFilter");
		//Assert::AreEqual(1, 0);
	}
};
