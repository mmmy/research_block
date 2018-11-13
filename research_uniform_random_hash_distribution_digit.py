#python 3.6
'''
统计均匀分布随机生成的hash值中所有十六进制字符在每一位出现的频率分布
'''
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import scipy.stats as stats
from uniform_random_blocks import blocks
from util import  create_hist_pd, stats_data

hash_list = blocks.hash
codes = [list(h) for h in hash_list]

#统计每一位频率分布
codes_hist, codes_hist_pd = create_hist_pd(codes)
#卡方相关性检验
#codes_hist_sum = codes_hist_pd.apply(np.sum)
#print(stats.chi2_contingency([codes_hist_sum.values, [2189952]*16]))

#计算统计信息：min max median, 卡方检验等等， 具体结果查看生成的csv
codes_hist_pd_stats = stats_data(codes_hist_pd)

file_name = 'uniform_random_548496_hash_codes_digit_distribution.csv'
codes_hist_pd_stats.to_csv('./temp/' + file_name)
print(file_name, '保存到temp/')
print('如果要生成柱形图，请运行codes_digit_distribution_graph.py, 具体请查看源码')

# plt.bar(sample_hist.index, sample_hist.values)
# plt.show()