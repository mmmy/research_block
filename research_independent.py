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
from util import  create_hist_pd, stats_data
import os.path

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

def union_code(h, start=0, count=50):
  codes = list(h)
  l = len(codes)
  pro = [x[0]+x[1] for x in itertools.product(codes, codes)]
  for i in range(l - 1, -1, -1): 
    del pro[i * (l + 1)]
  return pro[start : (start + count)]


def get_hist_pd_stats(start, count):
  codes_product = [union_code(h, start, count) for h in hash_list]
  if len(codes_product[0]) == 0:
    return None
  codes_product_hist, codes_product_hist_pd = create_hist_pd(codes_product)
  return stats_data(codes_product_hist_pd)

file_path = './temp/codes_product_hist_pd3.csv'

try:
  codes_product_hist_pd = pd.read_csv(file_path)
  start = codes_product_hist_pd.shape[0]
except:
  codes_product_hist_pd = None
  start = 0

count = 50

while True:
  print('start at', start)
  stats_pd = get_hist_pd_stats(start, count)
  if stats_pd is None:
    print('finish')
    break
  if codes_product_hist_pd is not None:
    codes_product_hist_pd = codes_product_hist_pd.append(stats_pd, sort=False, ignore_index=True)
  else:
    codes_product_hist_pd = stats_pd
  codes_product_hist_pd.to_csv(file_path)
  start = start + count

# result = codes_product_hist_pd.apply(lambda x:stats.chi2_contingency([x, [2142.5625]*256]), axis=1)
# result = codes_product_hist_pd.apply(lambda x:stats.chisquare(x), axis=1)
# print(codes_product)