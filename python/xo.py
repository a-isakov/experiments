import sys

from PyQt5.QtWidgets import QApplication, QWidget, QPushButton
from PyQt5.QtWidgets import QRadioButton, QLabel

class Example(QWidget):
    # ходит X
    x_turn = True
    # игра начата
    started = False
    # игровое поле 3x3
    field = [[0 for x in range(3)] for y in range(3)]

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setGeometry(300, 300, 400, 400)
        self.setWindowTitle('Крестики-нолики')

        self.btn_x = QRadioButton(self)
        self.btn_x.setText('X')
        self.btn_x.move(20, 20)
        self.btn_x.setChecked(True)
        self.btn_x.clicked.connect(self.radio_click)
        
        self.btn_o = QRadioButton(self)
        self.btn_o.setText('O')
        self.btn_o.move(60, 20)
        self.btn_o.clicked.connect(self.radio_click)
        
        for y in range(3):
            for x in range(3):
                field_btn = QPushButton('', self)
                field_btn.resize(40, 40)
                field_btn.move(20 + x * 40, 40 + y * 40)
                field_btn.clicked.connect(self.click)
                self.field[x][y] = field_btn
        
        self.result_label = QLabel(self)
        self.result_label.setText('')
        self.result_label.move(20, 180)
        self.result_label.resize(100, 20)
        
        self.btn_refresh = QPushButton('Новая игра', self)
        self.btn_refresh.resize(self.btn_refresh.sizeHint())
        self.btn_refresh.move(20, 220)
        self.btn_refresh.clicked.connect(self.refresh)
        
    # новая игра
    def refresh(self):
        self.started = False
        if self.btn_x.isChecked():
            self.x_turn = True
        else:
            self.x_turn = False
        self.result_label.setText('')
        for y in range(3):
            for x in range(3):
                self.field[x][y].setDisabled(False)
                self.field[x][y].setText('')

    # нажатие на кнопку поля
    def click(self):
        if self.sender().text() != '':
            # повторное нажатие
            return
        else:
            self.started = True
            if self.x_turn:
                self.sender().setText('X')
                self.x_turn = False
            else:
                self.sender().setText('O')
                self.x_turn = True
            # проверка победы
            if self.field[0][0].text() != '' and self.field[0][0].text() == self.field[1][0].text() and self.field[1][0].text() == self.field[2][0].text():
                self.finish(self.field[0][0].text())
            elif self.field[0][1].text() != '' and self.field[0][1].text() == self.field[1][1].text() and self.field[1][1].text() == self.field[2][1].text():
                self.finish(self.field[0][1].text())
            elif self.field[0][2].text() != '' and self.field[0][2].text() == self.field[1][2].text() and self.field[1][2].text() == self.field[2][2].text():
                self.finish(self.field[0][2].text())
            elif self.field[0][0].text() != '' and self.field[0][0].text() == self.field[0][1].text() and self.field[0][1].text() == self.field[0][2].text():
                self.finish(self.field[0][0].text())
            elif self.field[1][0].text() != '' and self.field[1][0].text() == self.field[1][1].text() and self.field[1][1].text() == self.field[1][2].text():
                self.finish(self.field[1][0].text())
            elif self.field[2][0].text() != '' and self.field[2][0].text() == self.field[2][1].text() and self.field[2][1].text() == self.field[2][2].text():
                self.finish(self.field[2][0].text())
            elif self.field[0][0].text() != '' and self.field[0][0].text() == self.field[1][1].text() and self.field[1][1].text() == self.field[2][2].text():
                self.finish(self.field[0][0].text())
            elif self.field[0][2].text() != '' and self.field[0][2].text() == self.field[1][1].text() and self.field[1][1].text() == self.field[2][0].text():
                self.finish(self.field[0][2].text())
            else:
                # проверка ничьи
                end = True
                for y in range(3):
                    for x in range(3):
                        if self.field[x][y].text() == '':
                            end = False
                if end:
                    self.finish('')

    # завершение игры
    def finish(self, c):
        if c == '':
            self.result_label.setText('Ничья!')
        else:
            self.result_label.setText('Выиграл ' + c + '!')
            for y in range(3):
                for x in range(3):
                    self.field[x][y].setDisabled(True)

    # переключатель первого хода
    def radio_click(self):
        if self.started is False:
            if self.sender().text() == 'X':
                self.x_turn = True
            elif self.sender().text() == 'O':
                self.x_turn = False

if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = Example()
    ex.show()
    sys.exit(app.exec())