import sys

import math
from PyQt5 import uic  # Импортируем uic
from PyQt5.QtWidgets import QApplication, QMainWindow


class MyWidget(QMainWindow):
    calc_works = True
    old_num = 0
    current_num = '0'
    current_dot = False
    operator = ''

    def __init__(self):
        super().__init__()
        uic.loadUi('calc.ui', self)  # Загружаем дизайн

        self.btn1.clicked.connect(self.num_click)
        self.btn2.clicked.connect(self.num_click)
        self.btn3.clicked.connect(self.num_click)
        self.btn4.clicked.connect(self.num_click)
        self.btn5.clicked.connect(self.num_click)
        self.btn6.clicked.connect(self.num_click)
        self.btn7.clicked.connect(self.num_click)
        self.btn8.clicked.connect(self.num_click)
        self.btn9.clicked.connect(self.num_click)
        self.btn0.clicked.connect(self.num_click)

        self.btn_plus.clicked.connect(self.operator_click)
        self.btn_minus.clicked.connect(self.operator_click)
        self.btn_mult.clicked.connect(self.operator_click)
        self.btn_div.clicked.connect(self.operator_click)
        self.btn_pow.clicked.connect(self.operator_click)
        self.btn_sqrt.clicked.connect(self.sqrt_click)
        self.btn_fact.clicked.connect(self.fact_click)

        self.btn_dot.clicked.connect(self.dot_click)
        self.btn_eq.clicked.connect(self.result_click)
        self.btn_clear.clicked.connect(self.c_click)

    def num_click(self):
        if self.calc_works:
            if self.current_num == '0':
                self.current_num = self.sender().text()
            else:
                self.current_num += self.sender().text()
            self.table.display(self.current_num)
        
    def operator_click(self):
        if self.calc_works:
            if self.table.value() != 'Error':
                self.operator = self.sender().text()
                self.old_num = float(self.current_num)
                self.current_num = '0'
                self.current_dot = False
        
    def sqrt_click(self):
        if self.calc_works:
            if self.table.value() != 'Error':
                if float(self.current_num) < 0:
                    self.table.display('Error')
                else:
                    self.current_num = str(math.sqrt(float(self.current_num)))
                    self.table.display(self.current_num)
        
    def fact_click(self):
        if self.calc_works:
            if self.table.value() != 'Error':
                self.current_num = str(math.factorial(float(self.current_num)))
                self.table.display(self.current_num)
        
    def c_click(self):
        if self.calc_works:
            self.table.display('')
            self.calc_works = False
        else:
            self.old_num = 0
            self.operator = ''
            self.current_num = '0'
            self.current_dot = False
            self.table.display('0')
            self.calc_works = True
        
    def dot_click(self):
        if self.calc_works:
            if self.current_dot is False:
                self.current_dot = True
                self.current_num += '.'
                self.table.display(self.current_num)
        
    def result_click(self):
        if self.calc_works:
            if self.operator != '':
                result = 0
                if self.operator == '+':
                    result = self.old_num + float(self.current_num)
                elif self.operator == '-':
                    result = self.old_num - float(self.current_num)
                elif self.operator == '*':
                    result = self.old_num * float(self.current_num)
                elif self.operator == '^':
                    result = math.pow(self.old_num, float(self.current_num))
                elif self.operator == '/' and self.current_num != '0':
                    result = self.old_num / float(self.current_num)
                else:
                    result = 'Error'
                self.table.display(str(result))
                self.old_num = 0
                self.operator = ''
                if result != 'Error':
                    self.current_num = str(result)
                    if self.current_num.find('.') == -1:
                        self.current_dot = False
                    else:
                        self.current_dot = True
                else:
                    self.current_num = '0'
                    self.current_dot = False

if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = MyWidget()
    ex.show()
    sys.exit(app.exec_())