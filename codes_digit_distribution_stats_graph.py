#python 3.6
'''
将research_btc_blocks_hash_distribution_digit.py 与 research_uniform_random_hash_distribution_digit.py
生成的结果csv中的mean, std, min 25%, 50%, 75%, max, chi, pvalue生成直观的柱形图，
'''
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib as mpl

def draw_graph(df, title, save_file_prefix):
  plt.figure()


codes_hist_file = './results/BTC_548496blocks_hash_sha256_codes_digit_distribution.csv'
codes_hist_df = pd.read_csv(codes_hist_file, index_col=0)
draw_graph(codes_hist_df, 'test', 'btc')

plt.show()