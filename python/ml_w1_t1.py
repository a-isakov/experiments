import pandas
import numpy as np

data = pandas.read_csv("titanic.csv", index_col = "PassengerId")
#print(data.head())
#print(data[:10])
#print(data['Survived'].sum()*100/data['Survived'].count())
#print(data['Pclass'].value_counts())
#print(data['Pclass'].count())
#print(data['Age'].mean())
#print(data['Age'].median())
#print(pandas.DataFrame(data, columns=['SibSp', 'Parch']).corr())
names=data[data['Sex']=='female']['Name']
first_names=[]
for name in names:
    if name.find('(') != -1:
        first_names.append(name.split('(')[1].split(' ')[0])
    else:
        first_names.append(name.split(',')[1].split('.')[1].split(' ')[1].replace('(', '').replace(')', ''))
    #first_names.append(name.split(',')[1].split('.')[1].split(' ')[1].replace('(', '').replace(')', ''))
#print(first_names)
print(pandas.DataFrame(first_names, columns=['name'])['name'].value_counts())