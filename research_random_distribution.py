#python 3.6
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

symbols = '0123456789abcdef'
def random_symbol():
  return symbols[int(np.floor(np.random.random() * 16))]

sample = [random_symbol() for i in range(int(5e5))]

sample_hist = pd.Series(sample).value_counts().sort_index(axis=0)

plt.bar(sample_hist.index, sample_hist.values)
plt.show()