import sys

from PyQt5.QtWidgets import QApplication, QWidget, QPushButton
from PyQt5.QtWidgets import QLabel
from PyQt5 import QtCore
from PyQt5.QtGui import QFont

class Example(QWidget):
    old_num = 0
    current_num = '0'
    current_positive = True
    current_dot = False
    operator = ''

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setGeometry(300, 300, 200, 310)
        self.setWindowTitle('Калькулятор')

        self.action_label = QLabel(self)
        self.action_label.setText('')
        self.action_label.move(0, 0)
        self.action_label.resize(200, 20)
        self.action_label.setAlignment(QtCore.Qt.AlignRight)
        
        self.current_label = QLabel(self)
        self.current_label.setText('0')
        self.current_label.move(0, 20)
        self.current_label.resize(200, 40)
        self.current_label.setAlignment(QtCore.Qt.AlignRight)
        
        font = QFont("Arial", 20)
        self.current_label.setFont(font)

        self.btn_7 = QPushButton('7', self)
        self.btn_7.resize(50, 50)
        self.btn_7.move(0, 60)
        self.btn_7.clicked.connect(self.num_click)
        
        self.btn_8 = QPushButton('8', self)
        self.btn_8.resize(50, 50)
        self.btn_8.move(50, 60)
        self.btn_8.clicked.connect(self.num_click)
        
        self.btn_9 = QPushButton('9', self)
        self.btn_9.resize(50, 50)
        self.btn_9.move(100, 60)
        self.btn_9.clicked.connect(self.num_click)
        
        self.btn_div = QPushButton('/', self)
        self.btn_div.resize(50, 50)
        self.btn_div.move(150, 60)
        self.btn_div.clicked.connect(self.operator_click)
        
        self.btn_4 = QPushButton('4', self)
        self.btn_4.resize(50, 50)
        self.btn_4.move(0, 110)
        self.btn_4.clicked.connect(self.num_click)
        
        self.btn_5 = QPushButton('5', self)
        self.btn_5.resize(50, 50)
        self.btn_5.move(50, 110)
        self.btn_5.clicked.connect(self.num_click)
        
        self.btn_6 = QPushButton('6', self)
        self.btn_6.resize(50, 50)
        self.btn_6.move(100, 110)
        self.btn_6.clicked.connect(self.num_click)
        
        self.btn_mul = QPushButton('*', self)
        self.btn_mul.resize(50, 50)
        self.btn_mul.move(150, 110)
        self.btn_mul.clicked.connect(self.operator_click)
        
        self.btn_1 = QPushButton('1', self)
        self.btn_1.resize(50, 50)
        self.btn_1.move(0, 160)
        self.btn_1.clicked.connect(self.num_click)
        
        self.btn_2 = QPushButton('2', self)
        self.btn_2.resize(50, 50)
        self.btn_2.move(50, 160)
        self.btn_2.clicked.connect(self.num_click)
        
        self.btn_3 = QPushButton('3', self)
        self.btn_3.resize(50, 50)
        self.btn_3.move(100, 160)
        self.btn_3.clicked.connect(self.num_click)
        
        self.btn_sub = QPushButton('-', self)
        self.btn_sub.resize(50, 50)
        self.btn_sub.move(150, 160)
        self.btn_sub.clicked.connect(self.operator_click)
        
        self.btn_c = QPushButton('C', self)
        self.btn_c.resize(50, 50)
        self.btn_c.move(0, 210)
        self.btn_c.clicked.connect(self.c_click)
        
        self.btn_0 = QPushButton('0', self)
        self.btn_0.resize(50, 50)
        self.btn_0.move(50, 210)
        self.btn_0.clicked.connect(self.num_click)
        
        self.btn_ce = QPushButton('CE', self)
        self.btn_ce.resize(50, 50)
        self.btn_ce.move(100, 210)
        self.btn_ce.clicked.connect(self.ce_click)
        
        self.btn_sum = QPushButton('+', self)
        self.btn_sum.resize(50, 50)
        self.btn_sum.move(150, 210)
        self.btn_sum.clicked.connect(self.operator_click)
        
        self.btn_dot = QPushButton('.', self)
        self.btn_dot.resize(50, 50)
        self.btn_dot.move(0, 260)
        self.btn_dot.clicked.connect(self.dot_click)
        
        self.btn_sign = QPushButton('±', self)
        self.btn_sign.resize(50, 50)
        self.btn_sign.move(50, 260)
        self.btn_sign.clicked.connect(self.sign_click)
        
        self.btn_result = QPushButton('=', self)
        self.btn_result.resize(100, 50)
        self.btn_result.move(100, 260)
        self.btn_result.clicked.connect(self.result_click)
        
    def num_click(self):
        if self.current_num == '0':
            self.current_num = self.sender().text()
        else:
            self.current_num += self.sender().text()
        self.current_label.setText(self.get_current_num())
        
    def operator_click(self):
        if self.current_label.text() != 'Error':
            self.operator = self.sender().text()
            self.action_label.setText(self.get_current_num() + self.operator)
            self.old_num = float(self.get_current_num())
            self.reset_current_num()
        
    def c_click(self):
        self.old_num = 0
        self.operator = ''
        self.action_label.setText('')
        self.reset_current_num()
        
    def ce_click(self):
        self.reset_current_num()
        
    def dot_click(self):
        if self.current_dot is False:
            self.current_dot = True
            self.current_num += '.'
            self.current_label.setText(self.get_current_num())
        
    def sign_click(self):
        if self.current_num == '0':
            return
        self.current_positive = not self.current_positive
        self.current_label.setText(self.get_current_num())
        
    def result_click(self):
        if self.operator == '':
            return
        else:
            result = 0
            if self.operator == '+':
                result = self.old_num + float(self.get_current_num())
            elif self.operator == '-':
                result = self.old_num - float(self.get_current_num())
            elif self.operator == '*':
                result = self.old_num * float(self.get_current_num())
            elif self.operator == '/' and self.current_num != '0':
                result = self.old_num * float(self.get_current_num())
            else:
                result = 'Error'
            self.current_label.setText(str(result))
            self.old_num = 0
            self.operator = ''
            self.action_label.setText('')
            if result != 'Error':
                if result < 0:
                    self.current_num = str(-result)
                    self.current_positive = False
                else:
                    self.current_num = str(result)
                    self.current_positive = True
                if self.current_num.find('.') == -1:
                    self.current_dot = False
                else:
                    self.current_dot = True
            else:
                self.current_num = '0'
                self.current_positive = True
                self.current_dot = False

    def get_current_num(self):
        sign = ''
        if self.current_positive is False:
            sign = '-'
        return sign + self.current_num
    
    def reset_current_num(self):
        self.current_label.setText('0')
        self.current_num = '0'
        self.current_dot = False
        self.current_positive = True

if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = Example()
    ex.show()
    sys.exit(app.exec())