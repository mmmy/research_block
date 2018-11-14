#python 3.6
'''
将research_btc_blocks_hash_distribution_digit.py 与 research_uniform_random_hash_distribution_digit.py
生成的结果csv中0123456789abcdef的分布生成直观的柱形图，
由于sha256有64位，所以这里每一个结果都有64个柱形图，
为了尽可能的显示在一张A4纸上，我们每一页显示16个
'''
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib as mpl

import sys

# mpl.rcParams['font.family']="SimSun"
# x表示第几位，从左往右
def draw_graphs(df, start_x, title, save_file_name):
  graph_cols = 4
  graph_rows = int(np.ceil(df.shape[0] / 4))

  fig, axes = plt.subplots(graph_rows, graph_cols, figsize=(10, 15))
  fig.subplots_adjust(left=0.05, bottom=0.02, right=0.99, top=0.95)
  fig.suptitle(title, fontproperties="SimHei", fontsize=16)
  axes = axes.ravel()
  for i in range(df.shape[0]):
    hist = df.iloc[i][0:16]
    ax = axes[i]
    ax.yaxis.set_major_formatter(mpl.ticker.FuncFormatter(lambda x, p: str(int(x / 1000)) + 'k'))
    ax.bar(hist.index, hist.values)
    ax.set_title('X={}'.format(i + start_x), fontsize=12)

  fig.savefig('./temp/{}'.format(save_file_name))
  print(save_file_name, '已经保存在temp/')
# btc
codes_hist_file = './results/BTC_548496blocks_hash_sha256_codes_digit_distribution.csv'
codes_hist_df = pd.read_csv(codes_hist_file, index_col=0)

def get_btc_title(index):
  return '({}/4)比特币区块链548496个区块hash值再进行一次sha256后各位16进制字符频率分布，X从左到右'.format(index)

draw_graphs(codes_hist_df.iloc[0:16], 0, get_btc_title(1), 'btc_548496_blocks_hash_sha256_codes_hist_1.jpg')
draw_graphs(codes_hist_df.iloc[16:32], 16, get_btc_title(2), 'btc_548496_blocks_hash_sha256_codes_hist_2.jpg')
draw_graphs(codes_hist_df.iloc[32:48], 32, get_btc_title(3), 'btc_548496_blocks_hash_sha256_codes_hist_3.jpg')
draw_graphs(codes_hist_df.iloc[48:64], 48, get_btc_title(4), 'btc_548496_blocks_hash_sha256_codes_hist_4.jpg')

# uniform random hash for benchmark
random_codes_hist_file = './results/uniform_random_548496_hash_codes_digit_distribution.csv'
random_codes_hist_df = pd.read_csv(random_codes_hist_file, index_col=0)

def get_benchmark_title(index):
  return '({}/4)python随机均分布生成548496个随机hash后各位16进制字符频率分布，X从左到右'.format(index)

draw_graphs(codes_hist_df.iloc[0:16], 0, get_benchmark_title(1), 'uniform_random_548496_hash_codes_hist_1.jpg')
draw_graphs(codes_hist_df.iloc[16:32], 16, get_benchmark_title(2), 'uniform_random_548496_hash_codes_hist_2.jpg')
draw_graphs(codes_hist_df.iloc[32:48], 32, get_benchmark_title(3), 'uniform_random_548496_hash_codes_hist_3.jpg')
draw_graphs(codes_hist_df.iloc[48:64], 48, get_benchmark_title(4), 'uniform_random_548496_hash_codes_hist_4.jpg')

# plt.show()