import os
import piexif
 
path = "C:\\Users\\alexx\\OneDrive\\Изображения\\Camera Roll\\2021"
dir_list = os.listdir(path)
 
print("Files and directories in '", path, "' :")
 
counter = dict()
for item in dir_list:
    full_name = path + "\\" + item
    if os.path.isdir(full_name):
        break
    ext = item.split(".")[-1].lower()
    if ext != "heic" and ext != "mov" and ext != "mp4":
        if ext in counter.keys():
            counter[ext] += 1
        else:
            counter[ext] = 1
        
        exif_dict = piexif.load(full_name)
        print(exif_dict)
print(counter)