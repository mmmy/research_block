'''
比特币548496个区块 生成双色球 数字 分布
file_name_2340 为 区块从0开始 每100个区块取， 共取2340 个， 用来对比真实的双色球共2340期
'''
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib as mpl
from matplotlib.gridspec import GridSpec
from util import hash_n, create_hist_pd, stats_data
from two_color_balls_stats_helper import plt_two_color_ball_stats

file_name = './temp/btc_548496blocks_hash_sha256_to_two_color_ball.csv'
file_name_2340 = './temp/btc_2340blocks_hash_sha256_to_two_color_ball.csv'

df = pd.read_csv(file_name, index_col=0)

plt_two_color_ball_stats(df, '比特币548496个区块hash值一次sha256之后，再生成双色球号码，数字频率分布统计', 'btc_548496blocks_hash_sha256')
# plt.show()

df_2340 = pd.read_csv(file_name_2340, index_col=0)
plt_two_color_ball_stats(df_2340, '比特币区块链中取出2340个区块的hash值一次sha256之后，再生成双色球号码，数字频率分布统计', 'btc_2340blocks_hash_sha256')
