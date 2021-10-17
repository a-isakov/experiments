# Напишите программу с графическим пользовательским интерфейсом на PyQt, которая создаёт изображение разноцветного (полосатого) флага.
# Количество цветов необходимо получить от пользователя с помощью диалогового окна.

# Цвета генерируются случайно.

import sys

from PyQt5.QtGui import QPainter, QColor
from PyQt5.QtWidgets import QWidget, QApplication, QPushButton
from PyQt5.QtWidgets import QInputDialog
import random

class Example(QWidget):
    colors = []

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setGeometry(300, 300, 200, 200)
        self.setWindowTitle('Генерация флага')
        self.btn = QPushButton('Ввести количество цветов флага', self)
        self.btn.resize(self.btn.sizeHint())
        self.btn.move(5, 5)
        self.do_paint = False
        self.btn.clicked.connect(self.paint)

    def paintEvent(self, event):
        if self.do_paint:
            qp = QPainter()
            qp.begin(self)
            self.draw_flag(qp)
            qp.end()

    def paint(self):
        colors, ok_pressed = QInputDialog.getInt(self, "Введите количество цветов флага", "Сколько цветов?", 3, 1, 7, 1)
        if ok_pressed:
            self.colors.clear()
            for i in range(colors):
                r = int(random.random() * 255)
                g = int(random.random() * 255)
                b = int(random.random() * 255)
                self.colors.append([r, g, b])
            self.do_paint = True
            self.repaint()

    def draw_flag(self, qp):
        for i in range(len(self.colors)):
            color = self.colors[i]
            r = color[0]
            g = color[1]
            b = color[2]
            qp.setBrush(QColor(r, g, b))
            qp.drawRect(30, 30 + 30 * i, 120, 30)


if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = Example()
    ex.show()
    sys.exit(app.exec())