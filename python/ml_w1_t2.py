import numpy as np
import pandas
from sklearn.tree import DecisionTreeClassifier

survived = pandas.read_csv("titanic.csv", index_col = "PassengerId")
# survived = data[data['Survived'] == 1]
survived = survived[~np.isnan(survived['Age'])]

array = survived.values
y = survived['Survived']

# df.loc[df['First Season'] > 1990, 'First Season'] = 1
survived.loc[survived['Sex'] == 'male', 'Sex'] = 1
survived.loc[survived['Sex'] == 'female', 'Sex'] = 0
survived.drop(['Survived', 'Name', 'SibSp', 'Parch', 'Ticket', 'Cabin', 'Embarked'], axis='columns', inplace=True)

classifier = DecisionTreeClassifier(random_state=241)
# y = survived['Survived']
fit = classifier.fit(survived, y)

importances = classifier.feature_importances_
print(list(survived))
print(importances)