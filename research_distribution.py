#python 3.6
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import hashlib

file = './data/blocks.csv'

blocks = pd.read_csv(file, header=None, names=['height', 'time', 'hash', 'main_chain'])

hash_list = blocks.hash
hash_list = [hashlib.sha256(h.encode('utf-8')).hexdigest() for h in hash_list]

codes = [list(h) for h in hash_list]

codes_pd = pd.DataFrame(codes)

codes_hist = [pd.Series(codes_pd[c]).value_counts().sort_index(axis=0) for c in codes_pd.columns]

fig, axes = plt.subplots(4, 16)

axes = axes.ravel()
for i in range(len(axes)):
  hist = codes_hist[i]
  ax = axes[i]
  ax.bar(hist.index, hist.values)
  ax.set_title(i)
plt.show()
