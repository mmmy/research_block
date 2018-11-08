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
import itertools

hash_list = blocks.hash
hash_list = [hash_n(h, 1) for h in hash_list]
'''
codes = [list(h) for h in hash_list]

codes_pd = pd.DataFrame(codes)

codes_hist = [pd.Series(codes_pd[c]).value_counts().sort_index(axis=0) for c in codes_pd.columns]
codes_hist_pd = pd.DataFrame(codes_hist)
'''
# codes_hist_pd['a'][1]
# print(codes_hist_pd)

# union hist

def union_code(h):
  codes = list(h)
  l = len(codes)
  pro = [x[0]+x[1] for x in itertools.product(codes, codes)]
  for i in range(l - 1, -1, -1): 
    del pro[i * (l + 1)]
  return pro[0:30]

codes_product = [union_code(h) for h in hash_list]
codes_product_pd = pd.DataFrame(codes_product)
codes_product_hist = [pd.Series(codes_product_pd[c]).value_counts().sort_index(axis=0) for c in codes_product_pd.columns]
codes_product_hist_pd = pd.DataFrame(codes_product_hist)

result = codes_product_hist_pd.apply(lambda x:stats.chi2_contingency([x, [2142.5625]*256]), axis=1)
# result = codes_product_hist_pd.apply(lambda x:stats.chisquare(x), axis=1)
mean = codes_product_hist_pd.mean(axis=1)
std = codes_product_hist_pd.std(axis=1)
chi2 = [s[0] for s in result]
pvalue = [s[1] for s in result]

codes_product_hist_pd['mean'] = mean
codes_product_hist_pd['std'] = std
# print(chi2)
codes_product_hist_pd['chi2'] = chi2
codes_product_hist_pd['pvalue'] = pvalue

codes_product_hist_pd.to_csv('./temp/codes_product_hist_pd1.csv')
# print(codes_product)