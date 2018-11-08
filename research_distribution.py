#python 3.6
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import hashlib
import sys
from blocks import blocks
from scipy.stats import kstest
import scipy.stats as stats
from util import hash_n, create_hist_pd, stats_data

symbols='0123456789abcdef'
show_graph = '--graph' in sys.argv

hash_list = blocks.hash
hash_list = [hash_n(h, 1) for h in hash_list]

codes = [list(h) for h in hash_list]

codes_hist, codes_hist_pd = create_hist_pd(codes)

codes_hist_sum = codes_hist_pd.apply(np.sum)
print(stats.chi2_contingency([codes_hist_sum.values, [2189952]*16]))

# result = codes_hist_pd.apply(lambda x:stats.chi2_contingency([x, [34281]*16]), axis=1)
# result = codes_hist_pd.apply(lambda x:stats.chisquare(x), axis=1)
vs = codes_hist_pd.iloc[0].values
# print(vs)
# print(stats.chisquare(vs, ddof=15))
# print(stats.chi2_contingency([vs, [34281] * 16]))
# print(result)

codes_hist_pd_stats = stats_data(codes_hist_pd)

codes_hist_pd_stats.to_csv('./temp/codes_hist2.csv')
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
