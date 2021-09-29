import sys

from PyQt5 import uic  # Импортируем uic
from PyQt5.QtWidgets import QApplication, QWidget
from PyQt5.QtCore import Qt

class MyWidget(QWidget):
    def __init__(self):
        super().__init__()
        uic.loadUi('sch.ui', self)  # Загружаем дизайн
        self.pushButton.clicked.connect(self.click)

    def click(self):
        if self.lineEdit.text() != '':
            date = str(self.calendarWidget.selectedDate().year()) + '-' + str(self.calendarWidget.selectedDate().month()).zfill(2) + '-' + str(self.calendarWidget.selectedDate().day()).zfill(2)
            time = str(self.timeEdit.time().hour()).zfill(2) + ':' + str(self.timeEdit.time().minute()).zfill(2) + ':' + str(self.timeEdit.time().second()).zfill(2)
            item = date + ' ' + time + ' ' + self.lineEdit.text()
            self.listWidget.addItem(item)
            order = Qt.AscendingOrder
            self.listWidget.sortItems(order)

if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = MyWidget()
    ex.show()
    sys.exit(app.exec_())