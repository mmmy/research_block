'''
双色球统计绘图
'''
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib as mpl
from matplotlib.gridspec import GridSpec
from util import hash_n, create_hist_pd, stats_data

def plt_two_color_ball_stats(df, title, file_prefix):
  red_ball_file = '{}_two_color_ball_red_distribution.csv'.format(file_prefix)
  df_red_ball = df[['r1','r2','r3','r4','r5','r6']]
  red_ball_hist, df_red_ball_hist = create_hist_pd(df_red_ball)
  df_red_ball_hist_sum = df_red_ball_hist.apply(np.sum)
  df_red_ball_hist_stats = stats_data(pd.DataFrame(df_red_ball_hist_sum).T)
  df_red_ball_hist_stats.to_csv('./temp/' + red_ball_file)
  red_r0 = df_red_ball_hist_stats.iloc[0]
  print(red_ball_file, '保存到temp/')

  blue_ball_file = '{}_two_color_ball_blue_distribution.csv'.format(file_prefix)
  df_blue_ball = df['b1']
  df_blue_ball_hist = pd.DataFrame(df_blue_ball.value_counts().sort_index(axis=0)).T
  df_blue_ball_hist_sum = df_blue_ball_hist.apply(np.sum)
  df_blue_ball_hist_stats = stats_data(pd.DataFrame(df_blue_ball_hist_sum).T)
  blue_r0 = df_blue_ball_hist_stats.iloc[0]
  df_blue_ball_hist_stats.to_csv('./temp/' + blue_ball_file)
  print(blue_ball_file, '保存到temp/')

  fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 15))
  fig.subplots_adjust(left=0.1, bottom=0.05, right=0.95, top=0.93)
  ax1.grid(True)
  ax1.bar(df_red_ball_hist_sum.index, df_red_ball_hist_sum.values)
  ax1.set_title(title + ' - 红球(33选6)\n\
                mean={}, std={}\nmin={}, 25%={}, 75%={}, max={}\nchi={}, pvalue={}'\
                .format(red_r0['mean'], red_r0['std'], red_r0['min'], red_r0['25%'], red_r0['75%'], red_r0['max'], red_r0['chi'], red_r0['pvalue']),
                fontproperties="SimHei", fontsize=14, loc="left")

  # ax2.margins(x=0, y=0.2)
  ax2.grid(True)
  ax2.bar(df_blue_ball_hist_sum.index, df_blue_ball_hist_sum.values)
  ax2.set_title(title + ' - 蓝球(16选1)\n\
                mean={}, std={}\nmin={}, 25%={}, 75%={}, max={}\nchi={}, pvalue={}'\
                .format(blue_r0['mean'], blue_r0['std'], blue_r0['min'], blue_r0['25%'], blue_r0['75%'], blue_r0['max'], blue_r0['chi'], blue_r0['pvalue']),
                fontproperties="SimHei", fontsize=14, loc="left")

  img_file = file_prefix + '_two_color_ball_stats.jpg'
  fig.savefig('./temp/' + img_file)
  print(img_file, '保存到temp/')
