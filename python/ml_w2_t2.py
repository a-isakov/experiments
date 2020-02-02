import pandas as pd
import numpy as np
import sklearn.datasets
from sklearn.neighbors import KNeighborsRegressor
from sklearn.preprocessing import scale
from sklearn.model_selection import cross_val_score
from sklearn.model_selection import KFold

dataset = sklearn.datasets.load_boston()
X = scale(dataset.data)
kf = KFold(n_splits=5, shuffle=True, random_state=42)
best_p = 0
max_mean = -1000
for p in np.linspace(1, 10, num = 200):
    regressor = KNeighborsRegressor(n_neighbors=5, weights='distance', p=p)
    mean = cross_val_score(regressor, X, y=dataset.target, scoring='neg_mean_squared_error').mean()
    print("p =", p, ", mean =", mean)
    if mean > max_mean:
        max_mean = mean
        best_p = p
print("============================")
print("p =", best_p, ", mean =", max_mean)