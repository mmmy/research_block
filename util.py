#python 3.6
import numpy as np
import pandas as pd
# import matplotlib.pyplot as plt
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
  m = len(base_symbols)
  results = []
  number = int(x, 16)
  while number > 0:
    mod = number % m
    number -= mod
    number //= m
    # number = int(number)
    results.append(base_symbols[mod])
  return results

'''

'''
# 从16进制hash中取出一个数列
# uniq 每个数字是否只能取出一次
# count 取出的数量
def permutation_from_hex(x, base_symbols, uniq, count=-1):
  results = []
  bs = list(base_symbols)
  number = int(x, 16)
  while number > 0:
    m = len(bs)
    if m == 0:
      break
    mod = number % m       # 求余数
    symbol = bs[mod]      # 取数
    number -= mod
    number //= m
    results.append(symbol)
    if count > 0 and len(results) >= count :
      break
    if uniq:               # 不重复取值
      del bs[mod]
  
  return results, hex(number)

def hex_to_series(x, rules):
  series = []
  for rule in rules:
    results, rest_x = permutation_from_hex(x, rule['symbols'], rule['unique'], rule['count'])
    series.append({
      'symbol_list': results,
      'index_list': [rule['symbols'].index(s) for s in results]
    })
    x = rest_x
  return series
# test
'''
rules = [
  {  
    'symbols': range(1, 34), #'0123456789abcdefghijklmnopqrstuvw',
    'unique': True,
    'count': 6
  }, {
    'symbols': range(1, 17), #'0123456789abcdef',
    'unique': True,
    'count': 1
  }
]

print(hex_to_series('8d98fb67850b4fd740330f2e5067595962c61ac86a3358ba5a4de55e66ff5704', rules))
'''