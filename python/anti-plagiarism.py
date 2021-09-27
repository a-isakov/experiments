import sys

from PyQt5 import uic  # Импортируем uic
from PyQt5.QtWidgets import QApplication, QMainWindow
from difflib import SequenceMatcher

class MyWidget(QMainWindow):
    def __init__(self):
        super().__init__()
        uic.loadUi('anti.ui', self)  # Загружаем дизайн

if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = MyWidget()
    ex.show()
    sys.exit(app.exec_())