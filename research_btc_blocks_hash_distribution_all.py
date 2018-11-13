#python 3.6
'''
统计比特币区块hash在进行一次sha256之后的hash中所有十六进制字符出现的频率分布
'''
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import hashlib
import sys
from btc_blocks import blocks
from scipy.stats import kstest
import scipy.stats as stats
from util import hash_n, create_hist_pd, stats_data

csv_file_name = 'BTC_548496blocks_hash_sha256_all_codes_distribution.csv'
img_file_name = 'BTC_548496blocks_hash_sha256_all_codes_distribution.jpg'

hash_list = blocks.hash
#进行一次sha256
hash_list = [hash_n(h, 1) for h in hash_list]

codes = [list(h) for h in hash_list]
#统计每一位频率分布
codes_hist, codes_hist_pd = create_hist_pd(codes)
#求总数
codes_hist_sum = codes_hist_pd.apply(np.sum)
#计算统计信息：min max median, 卡方检验等等， 具体结果查看生成的csv
codes_hist_sum_stats = stats_data(pd.DataFrame(codes_hist_sum).T)
codes_hist_sum_stats.to_csv('./temp/' + csv_file_name)
print(csv_file_name, '保存到temp/')
# result = codes_hist_pd.apply(lambda x:stats.chi2_contingency([x, [34281]*16]), axis=1)
# result = codes_hist_pd.apply(lambda x:stats.chisquare(x), axis=1)

# print(codes_hist_pd)
r0 = codes_hist_sum_stats.iloc[0]
#绘制柱形图
plt.figure(figsize=(8,5))
plt.subplots_adjust(left=0.1, bottom=0.05, right=0.95, top=0.85)
plt.bar(codes_hist_sum.index, codes_hist_sum.values)
plt.title('all codes distribution in BTC 548496 blocks\' hash\n\
          mean={}, std={}\nmin={}, 25%={}, 75%={}, max={}\nchi={}, pvalue={}'\
          .format(r0['mean'], r0['std'], r0['min'], r0['25%'], r0['75%'], r0['max'], r0['chi'], r0['pvalue']))
plt.savefig('./temp/' + img_file_name)
print(img_file_name, '保存到temp/')
plt.show()
