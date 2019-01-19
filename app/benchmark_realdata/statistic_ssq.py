from db import get_ssq, get_ssq_btc
import pandas as pd
import numpy as np
import os.path
import scipy.stats as stats
import matplotlib.pyplot as plt

ssq_real = list(get_ssq())[0]

ssq_btc = list(get_ssq_btc())[0]

ssq_real_df = pd.DataFrame(ssq_real)
ssq_btc_df = pd.DataFrame(ssq_btc)

ssq_start_date = ssq_real_df['date'].iat[0]
ssq_end_date = ssq_real_df['date'].iat[-1]

ssq_btc_start_date = ssq_btc_df['date'].iat[0]
ssq_btc_end_date = ssq_btc_df['date'].iat[-1]
# print(ssq_real_df)

temp_path = os.path.dirname(os.path.abspath(__file__)) + '/temp'

ssq_real_df.to_csv(temp_path + '/ssq.csv', columns=['date', 'id', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'b1'], index=False)
ssq_btc_df.to_csv(temp_path + '/ssq_btc.csv', columns=['date', 'id', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'b1'], index=False)

# 统计
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

def plt_ssq_stats(df, title, file_prefix):
  df_red_ball = df[['r1','r2','r3','r4','r5','r6']].astype(int)
  red_ball_hist, df_red_ball_hist = create_hist_pd(df_red_ball)
  df_red_ball_hist_sum = df_red_ball_hist.apply(np.sum)
  df_red_ball_hist_stats = stats_data(pd.DataFrame(df_red_ball_hist_sum).T)
  red_r0 = df_red_ball_hist_stats.iloc[0]

  df_blue_ball = df['b1'].astype(int)
  df_blue_ball_hist = pd.DataFrame(df_blue_ball.value_counts().sort_index(axis=0)).T
  df_blue_ball_hist_sum = df_blue_ball_hist.apply(np.sum)
  df_blue_ball_hist_stats = stats_data(pd.DataFrame(df_blue_ball_hist_sum).T)
  blue_r0 = df_blue_ball_hist_stats.iloc[0]

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

  img_file = file_prefix + '_stats.png'
  fig.savefig(temp_path + '/' + img_file)
  print(img_file, '保存到temp/')

plt_ssq_stats(ssq_real_df, '从{}到{}共{}期双色球号码频率分布'.format(ssq_start_date, ssq_end_date, len(ssq_real)), 'ssq')
plt_ssq_stats(ssq_btc_df, '从{}到{}共{}期按真实双色球球开奖时间后的第一个比特币区块链hash\n生成双色球的号码频率分布'.format(ssq_btc_start_date, ssq_btc_end_date, len(ssq_btc)), 'ssq_btc')
