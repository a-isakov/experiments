import datetime

class testClass:
    dateCreated = None

    def __init__(self):
        self.dateCreated = datetime.datetime.now()

    def printStartMoment(self):
        print(self.dateCreated)
