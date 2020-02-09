import pandas as pd
import numpy as np
import sklearn
from sklearn.linear_model import Perceptron
from sklearn.preprocessing import StandardScaler

data = np.genfromtxt('perceptron-train.csv', delimiter=',')
y_train = data[:,0]
X_train = data[:,1:]

data_test = np.genfromtxt('perceptron-test.csv', delimiter=',')
y_test = data_test[:,0]
X_test = data_test[:,1:]

clf = Perceptron(random_state=241, max_iter=5, tol=None)
clf.fit(X_train, y_train)
predictions = clf.predict(X_test)
accuracy = sklearn.metrics.accuracy_score(y_test, predictions)
print(accuracy)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

clf_scaled = Perceptron(random_state=241, max_iter=5, tol=None)
clf_scaled.fit(X_train_scaled, y_train)
predictions_scaled = clf_scaled.predict(X_test_scaled)
accuracy_scaled = sklearn.metrics.accuracy_score(y_test, predictions_scaled)
print(accuracy_scaled)

print(accuracy_scaled - accuracy)