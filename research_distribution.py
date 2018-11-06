#python 3.6
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import hashlib
import sys
from blocks import blocks
from scipy.stats import kstest
import scipy.stats as stats

symbols='0123456789abcdef'
show_graph = '--graph' in sys.argv

hash_list = blocks.hash
hash_list = [hashlib.sha256(h.encode('utf-8')).hexdigest() for h in hash_list]

codes = [list(h) for h in hash_list]

codes_pd = pd.DataFrame(codes)
codes0 = [symbols.find(x) + 1 for x in codes_pd[0].values]
# print(codes0)
print(np.min(codes0))
print(np.max(codes0))
print(stats.chi2_contingency(codes0))
# print(kstest(codes0, stats.randint.cdf, args=(0, 16)))

codes_hist = [pd.Series(codes_pd[c]).value_counts().sort_index(axis=0) for c in codes_pd.columns]
codes_hist_pd = pd.DataFrame(codes_hist)
# codes_hist_pd.index.append('pvalue')
# result = codes_hist_pd.apply(lambda x: kstest(x, 'norm'), axis=1)
# print(result)
# codes_hist_pd.to_csv('./temp/codes_hist.csv')
# print(codes_hist_pd)

if show_graph:
  fig, axes = plt.subplots(4, 16)
  axes = axes.ravel()
  for i in range(len(axes)):
    hist = codes_hist[i]
    ax = axes[i]
    ax.bar(hist.index, hist.values)
    ax.set_title(i)
  plt.show()
