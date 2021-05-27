import win32api, win32con
import time

while True:
    win32api.mouse_event(win32con.MOUSEEVENTF_MOVE,2,0,0,0)
    time.sleep(1)
    win32api.mouse_event(win32con.MOUSEEVENTF_MOVE,0,2,0,0)
    time.sleep(1)
    win32api.mouse_event(win32con.MOUSEEVENTF_MOVE,-2,0,0,0)
    time.sleep(1)
    win32api.mouse_event(win32con.MOUSEEVENTF_MOVE,0,-2,0,0)
    time.sleep(1)
