import pandas as pd
import numpy as np
import sklearn
from sklearn.svm import SVC

data = np.genfromtxt('svm-data.csv', delimiter=',')