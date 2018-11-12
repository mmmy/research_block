#python 3.6
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

import sys

file_name = sys.argv[1]

data_pd = pd.read_csv(file_name, index_col=0)

graph_count = data_pd.shape[0]
graph_cols = 4

fig, axes = plt.subplots(16, graph_cols)
axes = axes.ravel()
plt.figure(figsize=(8,5))
for i in range(graph_count):
  hist = data_pd.iloc[i]
  ax = axes[i]
  ax.bar(hist.index, hist.values)
  ax.set_title(i)

plt.show()