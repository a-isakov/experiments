// MouseMover — a tiny Windows tray "mouse jiggler".
//
// Starts minimized to the system tray. While On, it nudges the system cursor
// by exactly 1 pixel once per second, walking a 1x1-pixel square
// (right -> down -> left -> up, repeating). This keeps the machine active
// without the cursor drifting away from where the user left it.
//
//  - Double-click the tray icon: toggle On/Off (icon reflects the state).
//  - Right-click the tray icon: context menu with "Turn on"/"Turn off"
//    (depending on state), a separator, and "Exit".

#include <windows.h>
#include <shellapi.h>
#include <string>

#include "resource.h"

#pragma comment(lib, "user32.lib")
#pragma comment(lib, "shell32.lib")
#pragma comment(lib, "advapi32.lib")

namespace {

constexpr UINT  WM_TRAYICON  = WM_APP + 1;   // tray notification callback
constexpr UINT  kTrayUID     = 1;            // tray icon id
constexpr UINT_PTR kTimerId  = 1;            // movement timer id
constexpr UINT  kIntervalMs  = 1000;         // 1 pixel per second
constexpr int   kSquareSide  = 1;            // side length of the square, in px

constexpr UINT  ID_TRAY_TOGGLE    = 1001;    // context menu: Turn on / Turn off
constexpr UINT  ID_TRAY_AUTOSTART = 1002;    // context menu: Autostart (checkbox)
constexpr UINT  ID_TRAY_EXIT      = 1003;    // context menu: Exit

// Per-user autostart registry location.
const wchar_t* const kRunKey =
    L"Software\\Microsoft\\Windows\\CurrentVersion\\Run";
const wchar_t* const kRunValue = L"MouseMover";

HINSTANCE        g_hinst   = nullptr;
HWND             g_hwnd    = nullptr;
NOTIFYICONDATAW  g_nid     = {};
HICON            g_iconOn  = nullptr;
HICON            g_iconOff = nullptr;
bool             g_running = false;

// Square walk state: direction index and steps taken on the current side.
int       g_dir  = 0;   // 0=right, 1=down, 2=left, 3=up
int       g_step = 0;
const int kDx[4] = { 1, 0, -1, 0 };
const int kDy[4] = { 0, 1, 0, -1 };

// Tracked cursor position in screen pixels. Using our own state instead of
// calling GetCursorPos every tick prevents MulDiv rounding errors from
// accumulating across cycles. We re-sync only when the user has clearly moved
// the mouse themselves (delta > 2 px).
int g_curX = 0;
int g_curY = 0;

// ----------------------------------------------------------------------------
// Autostart (per-user HKCU\...\Run entry)
// ----------------------------------------------------------------------------

bool IsAutostartEnabled() {
    HKEY key;
    if (RegOpenKeyExW(HKEY_CURRENT_USER, kRunKey, 0, KEY_QUERY_VALUE, &key)
            != ERROR_SUCCESS) {
        return false;
    }
    const bool found =
        RegQueryValueExW(key, kRunValue, nullptr, nullptr, nullptr, nullptr)
            == ERROR_SUCCESS;
    RegCloseKey(key);
    return found;
}

void SetAutostart(bool enable) {
    HKEY key;
    if (RegCreateKeyExW(HKEY_CURRENT_USER, kRunKey, 0, nullptr, 0,
                        KEY_SET_VALUE, nullptr, &key, nullptr)
            != ERROR_SUCCESS) {
        return;
    }
    if (enable) {
        wchar_t path[MAX_PATH] = {};
        GetModuleFileNameW(nullptr, path, MAX_PATH);
        std::wstring quoted = L"\"";
        quoted += path;
        quoted += L"\"";
        RegSetValueExW(key, kRunValue, 0, REG_SZ,
                       reinterpret_cast<const BYTE*>(quoted.c_str()),
                       static_cast<DWORD>((quoted.size() + 1) * sizeof(wchar_t)));
    } else {
        RegDeleteValueW(key, kRunValue);
    }
    RegCloseKey(key);
}

// ----------------------------------------------------------------------------
// Tray icon / state
// ----------------------------------------------------------------------------

void UpdateTray() {
    g_nid.uFlags = NIF_ICON | NIF_TIP;
    g_nid.hIcon  = g_running ? g_iconOn : g_iconOff;
    wcscpy_s(g_nid.szTip, g_running ? L"MouseMover \x2014 On"
                                    : L"MouseMover \x2014 Off");
    Shell_NotifyIconW(NIM_MODIFY, &g_nid);
}

void SetState(bool on) {
    if (g_running == on) {
        return;
    }
    g_running = on;
    if (g_running) {
        POINT pt;
        GetCursorPos(&pt);
        g_curX = pt.x;
        g_curY = pt.y;
        g_dir  = 0;
        g_step = 0;
        SetTimer(g_hwnd, kTimerId, kIntervalMs, nullptr);
    } else {
        KillTimer(g_hwnd, kTimerId);
    }
    UpdateTray();
}

void MoveOneStep() {
    // If the user moved the mouse noticeably, follow them (re-sync).
    // Otherwise keep our own tracked position so MulDiv rounding errors in the
    // absolute-coordinate conversion don't accumulate across cycles.
    POINT pt;
    GetCursorPos(&pt);
    if (abs(pt.x - g_curX) > 2 || abs(pt.y - g_curY) > 2) {
        g_curX = pt.x;
        g_curY = pt.y;
    }

    g_curX += kDx[g_dir];
    g_curY += kDy[g_dir];

    // Send as an ABSOLUTE move. A relative MOUSEEVENTF_MOVE of 1 is run
    // through the pointer-acceleration curve and often collapses to 0 px;
    // absolute coordinates bypass acceleration entirely.
    const int vx = GetSystemMetrics(SM_XVIRTUALSCREEN);
    const int vy = GetSystemMetrics(SM_YVIRTUALSCREEN);
    const int vw = GetSystemMetrics(SM_CXVIRTUALSCREEN);
    const int vh = GetSystemMetrics(SM_CYVIRTUALSCREEN);

    INPUT input    = {};
    input.type     = INPUT_MOUSE;
    input.mi.dx    = MulDiv(g_curX - vx, 65535, (vw > 1 ? vw : 2) - 1);
    input.mi.dy    = MulDiv(g_curY - vy, 65535, (vh > 1 ? vh : 2) - 1);
    input.mi.dwFlags = MOUSEEVENTF_MOVE | MOUSEEVENTF_ABSOLUTE | MOUSEEVENTF_VIRTUALDESK;
    SendInput(1, &input, sizeof(input));

    if (++g_step >= kSquareSide) {
        g_step = 0;
        g_dir  = (g_dir + 1) & 3;
    }
}

void ShowContextMenu(HWND hwnd) {
    POINT pt;
    GetCursorPos(&pt);

    HMENU menu = CreatePopupMenu();
    AppendMenuW(menu, MF_STRING, ID_TRAY_TOGGLE,
                g_running ? L"Turn off" : L"Turn on");
    AppendMenuW(menu, MF_STRING | (IsAutostartEnabled() ? MF_CHECKED : MF_UNCHECKED),
                ID_TRAY_AUTOSTART, L"Autostart");
    AppendMenuW(menu, MF_SEPARATOR, 0, nullptr);
    AppendMenuW(menu, MF_STRING, ID_TRAY_EXIT, L"Exit");

    // Required so the menu dismisses correctly when clicking elsewhere.
    SetForegroundWindow(hwnd);
    TrackPopupMenu(menu, TPM_RIGHTBUTTON, pt.x, pt.y, 0, hwnd, nullptr);
    PostMessageW(hwnd, WM_NULL, 0, 0);

    DestroyMenu(menu);
}

// ----------------------------------------------------------------------------
// Main window (hidden — only handles tray callbacks, the timer and the menu)
// ----------------------------------------------------------------------------

LRESULT CALLBACK WndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {
    case WM_TRAYICON:
        if (LOWORD(lParam) == WM_LBUTTONDBLCLK) {
            SetState(!g_running);
        } else if (LOWORD(lParam) == WM_RBUTTONUP ||
                   LOWORD(lParam) == WM_CONTEXTMENU) {
            ShowContextMenu(hwnd);
        }
        return 0;

    case WM_COMMAND:
        switch (LOWORD(wParam)) {
        case ID_TRAY_TOGGLE:
            SetState(!g_running);
            return 0;
        case ID_TRAY_AUTOSTART:
            SetAutostart(!IsAutostartEnabled());
            return 0;
        case ID_TRAY_EXIT:
            DestroyWindow(hwnd);
            return 0;
        }
        break;

    case WM_TIMER:
        if (wParam == kTimerId) {
            MoveOneStep();
        }
        return 0;

    case WM_DESTROY:
        Shell_NotifyIconW(NIM_DELETE, &g_nid);
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProcW(hwnd, msg, wParam, lParam);
}

}  // namespace

int APIENTRY wWinMain(HINSTANCE hInstance, HINSTANCE, LPWSTR, int) {
    // Single instance: autostart should never spawn a second tray icon.
    HANDLE mutex = CreateMutexW(nullptr, TRUE, L"MouseMover_SingleInstance");
    if (mutex && GetLastError() == ERROR_ALREADY_EXISTS) {
        return 0;
    }

    g_hinst = hInstance;

    const int smallCx = GetSystemMetrics(SM_CXSMICON);
    const int smallCy = GetSystemMetrics(SM_CYSMICON);
    g_iconOn  = static_cast<HICON>(LoadImageW(hInstance, MAKEINTRESOURCEW(IDI_ON),
                    IMAGE_ICON, smallCx, smallCy, LR_DEFAULTCOLOR));
    g_iconOff = static_cast<HICON>(LoadImageW(hInstance, MAKEINTRESOURCEW(IDI_OFF),
                    IMAGE_ICON, smallCx, smallCy, LR_DEFAULTCOLOR));

    WNDCLASSEXW wc = {};
    wc.cbSize        = sizeof(wc);
    wc.lpfnWndProc   = WndProc;
    wc.hInstance     = hInstance;
    wc.lpszClassName = L"MouseMoverWindow";
    RegisterClassExW(&wc);

    // A normal top-level window that is simply never shown. (Not message-only,
    // so SetForegroundWindow works and the popup menu dismisses correctly.)
    g_hwnd = CreateWindowExW(0, wc.lpszClassName, L"MouseMover", 0,
                             0, 0, 0, 0, nullptr, nullptr, hInstance, nullptr);
    if (!g_hwnd) {
        return 1;
    }

    // Add the tray icon (starts in the Off state).
    g_nid.cbSize           = sizeof(g_nid);
    g_nid.hWnd             = g_hwnd;
    g_nid.uID              = kTrayUID;
    g_nid.uFlags           = NIF_ICON | NIF_MESSAGE | NIF_TIP;
    g_nid.uCallbackMessage = WM_TRAYICON;
    g_nid.hIcon            = g_iconOff;
    wcscpy_s(g_nid.szTip, L"MouseMover \x2014 Off");
    Shell_NotifyIconW(NIM_ADD, &g_nid);

    MSG msg;
    while (GetMessageW(&msg, nullptr, 0, 0) > 0) {
        TranslateMessage(&msg);
        DispatchMessageW(&msg);
    }

    if (mutex) {
        CloseHandle(mutex);
    }
    return static_cast<int>(msg.wParam);
}
