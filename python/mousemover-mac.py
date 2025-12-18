import pyautogui
import time

# Отключаем failsafe (остановка при перемещении мыши в угол экрана)
pyautogui.FAILSAFE = False

while True:
    pyautogui.moveRel(2, 0)
    time.sleep(1)
    pyautogui.moveRel(0, 2)
    time.sleep(1)
    pyautogui.moveRel(-2, 0)
    time.sleep(1)
    pyautogui.moveRel(0, -2)
    time.sleep(1)
