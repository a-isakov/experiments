// ConsoleApp.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include "pch.h"
#include <iostream>
#include <unordered_map>
#include <map>
#include <string>
#include <vector>
#include "CLine.h"

int main()
{
    std::cout << "Hello World!\n";
	std::unordered_map<std::wstring, int> testMap;
	for (int i = 0; i < 10; i++) {
		std::wstring sItemIndex = L"Item";
		sItemIndex += std::to_wstring(i);

		testMap[sItemIndex] = std::rand();
	}
	
	for (std::pair<std::wstring, int> item : testMap) {
		std::wcout << item.first << L": " << item.second << L"\n";
	}
	std::wcout << testMap[L"newItem"];

	std::vector<int> vArray(5);
	for (int i = 0; i < vArray.size(); i++)
	{
		vArray[i] = std::rand();
	}

	std::map<std::wstring, int> anotherMap;
	//anotherMap = testMap;

	int q = 1;
}

// Run program: Ctrl + F5 or Debug > Start Without Debugging menu
// Debug program: F5 or Debug > Start Debugging menu

// Tips for Getting Started: 
//   1. Use the Solution Explorer window to add/manage files
//   2. Use the Team Explorer window to connect to source control
//   3. Use the Output window to see build output and other messages
//   4. Use the Error List window to view errors
//   5. Go to Project > Add New Item to create new code files, or Project > Add Existing Item to add existing code files to the project
//   6. In the future, to open this project again, go to File > Open > Project and select the .sln file
