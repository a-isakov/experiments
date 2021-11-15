import csv

latitude_min = int(input())
longitude_min = int(input())
latitude_max = int(input())
longitude_max = int(input())

with open('fjords.csv', encoding="utf8") as csvfile:
    reader = csv.DictReader(csvfile, delimiter=':', quotechar='"')
    for index, row in enumerate(reader):
        if int(row['latitude']) >= latitude_min and int(row['latitude']) <= latitude_max \
            and int(row['longitude']) >= longitude_min and int(row['longitude']) <= longitude_max:
            print(row['name'])
