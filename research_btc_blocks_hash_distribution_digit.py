#python 3.6
'''
统计比特币区块hash在进行一次sha256之后的hash中所有十六进制字符在每一位出现的频率分布
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

show_graph = '--graph' in sys.argv

hash_list = blocks.hash
#进行一次sha256
hash_list = [hash_n(h, 1) for h in hash_list]

codes = [list(h) for h in hash_list]

#统计每一位频率分布
codes_hist, codes_hist_pd = create_hist_pd(codes)

#卡方相关性检验
#codes_hist_sum = codes_hist_pd.apply(np.sum)
#print(stats.chi2_contingency([codes_hist_sum.values, [2189952]*16]))

#计算统计信息：min max median, 卡方检验等等， 具体结果查看生成的csv
codes_hist_pd_stats = stats_data(codes_hist_pd)

file_name = 'BTC_548496blocks_hash_sha256_codes_digit_distribution.csv'
print(file_name, '保存到temp/')
print('如果要生成柱形图，请运行codes_digit_distribution_graph.py, 具体请查看源码')
codes_hist_pd_stats.to_csv('./temp/' + file_name)
# print(codes_hist_pd)

#粗略绘制预览图
if show_graph:
  fig, axes = plt.subplots(4, 16)
  axes = axes.ravel()
  for i in range(len(axes)):
    hist = codes_hist[i]
    ax = axes[i]
    ax.bar(hist.index, hist.values)
    ax.set_title(i)
  plt.show()
