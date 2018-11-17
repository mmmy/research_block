'''
双色球历史数据 数字统计分布
'''
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib as mpl
from matplotlib.gridspec import GridSpec
from util import hash_n, create_hist_pd, stats_data
from two_color_balls_stats_helper import plt_two_color_ball_stats

file_name = './data/two_color_balls_real2340.csv'

df = pd.read_csv(file_name, index_col=0)

plt_two_color_ball_stats(df, '截止到2018-11-15共2340期双色球历史号码，数字频率分布统计', 'ssq_real_2340')
# plt.show()
