#include "pch.h"
#include "CShape.h"


CShape::CShape()
{
	sColor = L"Default";
	sName = L"NoName";
}


CShape::~CShape()
{
}

std::wstring CShape::GetColor()
{
	return sColor;
}

std::wstring CShape::GetName()
{
	return sName;
}
