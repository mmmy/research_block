#python 3.6
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import hashlib
import sys
from blocks import blocks
from scipy.stats import kstest
import scipy.stats as stats
from util import hash_n

symbols='0123456789abcdef'
show_graph = '--graph' in sys.argv

hash_list = blocks.hash
hash_list = [hash_n(h, 1) for h in hash_list]

codes = [list(h) for h in hash_list]

codes_pd = pd.DataFrame(codes)
codes0 = [symbols.find(x) + 1 for x in codes_pd[0].values]
# print(codes0)
print(np.min(codes0))
print(np.max(codes0))
# print(stats.chi2_contingency(codes0))
# print(kstest(codes0, stats.randint.cdf, args=(0, 16)))

codes_hist = [pd.Series(codes_pd[c]).value_counts().sort_index(axis=0) for c in codes_pd.columns]
codes_hist_pd = pd.DataFrame(codes_hist)
codes_hist_sum = codes_hist_pd.apply(np.sum)
print(stats.chi2_contingency([codes_hist_sum.values, [2189952]*16]))
# codes_hist_pd.index.append('pvalue')
result = codes_hist_pd.apply(lambda x:stats.chi2_contingency([x, [34281]*16]), axis=1)
# result = codes_hist_pd.apply(lambda x:stats.chisquare(x), axis=1)
vs = codes_hist_pd.iloc[0].values
# print(vs)
# print(stats.chisquare(vs, ddof=15))
# print(stats.chi2_contingency([vs, [34281] * 16]))
# print(result)
mean = codes_hist_pd.mean(axis=1)
std = codes_hist_pd.std(axis=1)
chi2 = [s[0] for s in result]
pvalue = [s[1] for s in result]

codes_hist_pd['mean'] = mean
codes_hist_pd['std'] = std
# print(chi2)
codes_hist_pd['chi2'] = chi2
codes_hist_pd['pvalue'] = pvalue
codes_hist_pd.to_csv('./temp/codes_hist1.csv')
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
