#python 3.6
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import hashlib
import sys
from blocks_random import blocks
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
codes_hist_sum_stats = stats_data(pd.DataFrame(codes_hist_sum).T)
codes_hist_sum_stats.to_csv('./temp/random_codes_hist_all.csv')
# result = codes_hist_pd.apply(lambda x:stats.chi2_contingency([x, [34281]*16]), axis=1)
# result = codes_hist_pd.apply(lambda x:stats.chisquare(x), axis=1)

# print(codes_hist_pd)
r0 = codes_hist_sum_stats.iloc[0]

if show_graph:
  plt.figure(figsize=(8,5))
  plt.subplots_adjust(left=0.1, bottom=0.05, right=0.95, top=0.85)
  plt.bar(codes_hist_sum.index, codes_hist_sum.values)
  plt.title('all codes distribution in uniform random 548496 hash\n\
           mean={}, std={}\nmin={}, 25%={}, 75%={}, max={}\nchi={}, pvalue={}'\
           .format(r0['mean'], r0['std'], r0['min'], r0['25%'], r0['75%'], r0['max'], r0['chi'], r0['pvalue']))
  plt.savefig('./temp/all_codes_distribution_uniform_random_548496_hash.jpg')
  plt.show()