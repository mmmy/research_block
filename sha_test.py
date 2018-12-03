import numpy as np
import pandas as pd
import hashlib
import scipy.stats
from util import  create_hist_pd, stats_data

data_len = 548496
symbols = '0123456789abcdef'
symbols_len = len(symbols)

def hash_n(str, times=1):
  result = str
  while times > 0:
    result = hashlib.sha512(result.encode('utf-8')).hexdigest()
    times-=1
  return result

def random_hash(l=128):
  s_list = [symbols[np.random.randint(symbols_len)] for i in range(l)]
  return ''.join(s_list)

def liner_hex(h, a, b):
  return hex(int(h, 16) * a + b)[2:]

random_hash_list = [random_hash() for i in range(data_len)]
random_hash_list_sha256_1 = [hash_n(h, 1) for h in random_hash_list]
random_hash_list_sha256_1_1 = [hash_n(liner_hex(h, 1, 1), 1) for h in random_hash_list]
random_hash_list_sha256_1_2 = [hash_n(liner_hex(h, 1, 2), 1) for h in random_hash_list]

def stats_codes_distribution(hash_list):
  codes = [list(h) for h in hash_list]
  #统计每一位频率分布
  codes_hist, codes_hist_pd = create_hist_pd(codes)
  #计算统计信息：min max median, 卡方检验等等， 具体结果查看生成的csv
  codes_hist_pd_stats = stats_data(codes_hist_pd)
  return codes_hist_pd_stats

random_codes_hist_pd_stats = stats_codes_distribution(random_hash_list)
# print(random_codes_hist_pd_stats)
print(random_codes_hist_pd_stats['pvalue'].mean())
random_codes_hist_pd_stats.to_csv('./temp/random_codes_hist_pd_stats.csv')

sha256_1_stats = stats_codes_distribution(random_hash_list_sha256_1)
print(sha256_1_stats['pvalue'].mean())

sha256_1_1_stats = stats_codes_distribution(random_hash_list_sha256_1_1)
# print(sha256_1_1_stats)
print(sha256_1_1_stats['pvalue'].mean())
sha256_1_1_stats.to_csv('./temp/sha256_1_1_stats.csv')

sha256_1_2_stats = stats_codes_distribution(random_hash_list_sha256_1_2)
# print(sha256_1_2_stats)
print(sha256_1_2_stats['pvalue'].mean())
# print(sha256_1_2_stats)