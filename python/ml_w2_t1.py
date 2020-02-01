from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import KFold
from sklearn.model_selection import cross_val_score
from sklearn.preprocessing import scale
import pandas
import numpy as np

data = np.genfromtxt('wine.data', delimiter=',')
y = data[:,0]
X = data[:,1:]
# data = pandas.read_csv("wine.data", header=None, delimiter=",")
# y = data.iloc[:, 1:13]
# X = data[0]
kf = KFold(n_splits=5, shuffle=True, random_state=42)
best_k = 0
max_m = 0
for k in range(1, 51):
    classifier = KNeighborsClassifier(n_neighbors=k)
    array_to_mean = cross_val_score(classifier, cv=kf, scoring='accuracy', X=X, y=y)
    m = array_to_mean.mean()
    if m > max_m:
        best_k = k
        max_m = m
    # print("k=", k, "m=", m)
print("k = ", best_k, "m = ", max_m)
print("=====")
scaled_X = scale(X)
best_k = 0
max_m = 0
for k in range(1, 51):
    classifier = KNeighborsClassifier(n_neighbors=k)
    array_to_mean = cross_val_score(classifier, cv=kf, scoring='accuracy', X=scaled_X, y=y)
    m = array_to_mean.mean()
    if m > max_m:
        best_k = k
        max_m = m
    # print("k=", k, "m=", m)
print("k = ", best_k, "m = ", max_m)
