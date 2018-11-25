#python 3.6
'''
将research_btc_blocks_hash_distribution_digit.py 与 research_uniform_random_hash_distribution_digit.py
生成的结果csv中的mean, std, min 25%, 50%, 75%, max, chi, pvalue生成直观的柱形图，
'''
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib as mpl
from matplotlib.gridspec import GridSpec

only_btc = False

codes_hist_file = './results/BTC_548496blocks_hash_sha256_codes_digit_distribution.csv'
codes_hist_df = pd.read_csv(codes_hist_file, index_col=0)

random_codes_hist_file = './results/uniform_random_548496_hash_codes_digit_distribution.csv'
random_codes_hist_df = pd.read_csv(random_codes_hist_file, index_col=0)

x = range(random_codes_hist_df.shape[0])
fig = plt.figure(figsize=(10, 15))
fig.suptitle('比特币548496个区块hash值再进行一次sha256之后各位数上16进制字符频率分布统计\nbenchmark为均匀分布随机生成的容量相同的sha256样本', fontproperties="SimHei", fontsize=16)

gs = GridSpec(5, 3, figure=fig)
# fig, (ax1, ax2, ax3, ax4) = plt.subplots(4, 1, figsize=(10, 15))
fig.subplots_adjust(left=0.08, bottom=0.02, right=0.98, top=0.93)
ax1 = fig.add_subplot(gs[0:2, :])
ax2 = fig.add_subplot(gs[2, :])
ax3 = fig.add_subplot(gs[3, :])
ax4 = fig.add_subplot(gs[4, :])

ax1.set_ylim(ymin=33600, ymax=35300)
# ax1.set_ylim(auto=True)
ax1.plot(x, codes_hist_df['mean'], 'b-')
not only_btc and ax1.plot(x, random_codes_hist_df['mean'], 'b-', dashes=[1, 1])
ax1.plot(x, codes_hist_df['min'], 'g-')
not only_btc and ax1.plot(x, random_codes_hist_df['min'], 'g-', dashes=[1, 1])
ax1.plot(x, codes_hist_df['25%'], 'c-')
not only_btc and ax1.plot(x, random_codes_hist_df['25%'], 'c-', dashes=[1, 1])
ax1.plot(x, codes_hist_df['50%'], 'r-')
not only_btc and ax1.plot(x, random_codes_hist_df['50%'], 'r-', dashes=[1, 1])
ax1.plot(x, codes_hist_df['75%'], 'k-')
not only_btc and ax1.plot(x, random_codes_hist_df['75%'], 'k-', dashes=[1, 1])
ax1.plot(x, codes_hist_df['max'], 'm-')
not only_btc and ax1.plot(x, random_codes_hist_df['max'], 'm-', dashes=[1, 1])
ax1.grid(True)

ax1.legend(('btc mean',
            'benchmark mean',
            'btc min',
            'benchmark min',
            'btc 25%',
            'benchmark 25%',
            'btc 50%',
            'benchmark 50%',
            'btc 75%',
            'benchmark 75%',
            'btc max',
            'benchmark max')[::(2 if only_btc else 1)], loc='upper center', ncol=4)

ax1.set_ylabel('frequency(频率)', fontproperties="SimHei", fontsize=14)
# ax1.set_xlabel('index of digit')
# 绘制标准差
ax2.plot(x, codes_hist_df['std'], 'r-')
ax2.plot(x, random_codes_hist_df['std'], 'g-', dashes=[1, 1])
ax2.grid(True)
ax2.legend(('btc std', 'benchmark std'))
ax2.set_ylabel('std(标准差)', fontproperties="SimHei", fontsize=14)

# 绘制卡防检验值
ax3.plot(x, codes_hist_df['chi'], 'r-')
ax3.plot(x, random_codes_hist_df['chi'], 'g-', dashes=[1, 1])
ax3.grid(True)
ax3.legend(('btc chi', 'benchmark chi'))
ax3.set_ylabel('chi(卡方检验值)', fontproperties="SimHei", fontsize=14)

# 绘制卡防检验pvalue
ax4.plot(x, codes_hist_df['pvalue'], 'r-')
ax4.plot(x, random_codes_hist_df['pvalue'], 'g-', dashes=[1, 1])
ax4.grid(True)
ax4.legend(('btc pvalue', 'benchmark pvalue'))
ax4.set_ylabel('pvalue(卡方检验结果)', fontproperties="SimHei", fontsize=14)

fig.savefig('./temp/btc_blocks_hash_sha256_vs_random_hash.png')
plt.show()
