#pragma once

#include <string>

class CShape
{
public:
	CShape();
	virtual ~CShape();

	virtual std::wstring GetColor();
	virtual std::wstring GetName();

protected:
	std::wstring sColor;
	std::wstring sName;
};

