#python 3.6
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import scipy.stats as stats
import hashlib

def hash_n(str, times=1):
  result = str
  while times > 0:
    result = hashlib.sha256(result.encode('utf-8')).hexdigest()
    times-=1
  return result

def create_hist_pd(codes):
  codes_pd = pd.DataFrame(codes)
  codes_hist = [pd.Series(codes_pd[c]).value_counts().sort_index(axis=0) for c in codes_pd.columns]
  codes_hist_pd = pd.DataFrame(codes_hist)
  return codes_hist, codes_hist_pd

def stats_data(data_pd: pd.DataFrame):
  describe_row = data_pd.T.describe().T
  chi_result = data_pd.apply(lambda x:stats.chisquare(x), axis=1)
  chi = [s[0] for s in chi_result]
  pvalue = [s[1] for s in chi_result]
  new_pd = pd.concat([data_pd, describe_row],axis=1)
  new_pd['chi'] = chi
  new_pd['pvalue'] = pvalue
  return new_pd

def hex_to_base_n(x, base_symbols):
  pass

'''

'''
# 从16进制hash中取出一个数列
def permutation_from_hex(x, base_symbols, uniq, count):
  results = []
  bs = list(base_symbols)
  number = int(x, 16)
  while number > 0:
    m = len(bs)
    if m == 0:
      break
    mod = number % m       # 求余数
    symbol = bs[mode]      # 取数
    number -= mod
    number /= m
    number = int(number)
    results.append(symbol)
    if count > 0 && len(results) >= count :
      break
    if uniq:               # 不重复取值
      del bs[mod]
  
  return results, number