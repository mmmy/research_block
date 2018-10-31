#python 3.6
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

file = './data/blocks.csv'

blocks = pd.read_csv(file, header=None, names=['height', 'time', 'hash', 'main_chain'])

index = -2

codes = [h[index] for h in blocks.hash]

codes_hist = pd.Series(codes).value_counts()

codes_hist = codes_hist.sort_index(axis=0)

plt.bar(codes_hist.index, codes_hist.values)
plt.show()