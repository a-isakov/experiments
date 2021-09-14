class Note:
    note = None
    
    def __init__(self, note, length=False):
        if note == "до":
            if not length:
                self.note = "до"
            else:
                self.note = "до-о"
        elif note == "ре":
            if not length:
                self.note = "ре"
            else:
                self.note = "ре-э"
        elif note == "ми":
            if not length:
                self.note = "ми"
            else:
                self.note = "ми-и"
        elif note == "фа":
            if not length:
                self.note = "фа"
            else:
                self.note = "фа-а"
        elif note == "соль":
            if not length:
                self.note = "соль"
            else:
                self.note = "со-оль"
        elif note == "ля":
            if not length:
                self.note = "ля"
            else:
                self.note = "ля-а"
        elif note == "си":
            if not length:
                self.note = "си"
            else:
                self.note = "си-и"
        else:
            self.note = ""

    def __str__(self):
        return self.note

do_1 = Note("до", False)
doo = Note("до", True)
do_2 = Note("до")
print(do_1, doo, do_2)