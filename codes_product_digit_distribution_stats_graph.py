#python 3.6
'''
研究统计任意两位组合的频率分布， 用来验证每一位的独立性， 共有16 * 16 = 256中组合
btc_548496_blocks_hash_sha256_codes_product_hist_pd.py 与 uniform_random_548496_hash_codes_product_hist_pd.csv
生成的结果csv中的mean, std, min 25%, 50%, 75%, max, chi, pvalue生成直观的柱形图，
'''
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib as mpl
from matplotlib.gridspec import GridSpec

codes_hist_file = './results/btc_548496_blocks_hash_sha256_codes_product_hist_pd.csv'
codes_hist_df = pd.read_csv(codes_hist_file, index_col=0)

random_codes_hist_file = './results/uniform_random_548496_hash_codes_product_hist_pd.csv'
random_codes_hist_df = pd.read_csv(random_codes_hist_file, index_col=0)

x = range(random_codes_hist_df.shape[0])
fig = plt.figure(figsize=(10, 15))
fig.suptitle('比特币548496个区块hash值再进行一次sha256之后两位按笛卡尔组合字符(双16进制)频率分布统计\nbenchmark为均匀分布随机生成的容量相同的sha256样本', fontproperties="SimHei", fontsize=16)

gs = GridSpec(5, 3, figure=fig)
# fig, (ax1, ax2, ax3, ax4) = plt.subplots(4, 1, figsize=(10, 15))
fig.subplots_adjust(left=0.08, bottom=0.02, right=0.98, top=0.93)
ax1 = fig.add_subplot(gs[0:2, :])
ax2 = fig.add_subplot(gs[2, :])
ax3 = fig.add_subplot(gs[3, :])
ax4 = fig.add_subplot(gs[4, :])

ax1.set_ylim(ymin=1900, ymax=2500)
# ax1.set_ylim(auto=True)
ax1.plot(x, codes_hist_df['mean'], 'b-')
ax1.plot(x, random_codes_hist_df['mean'], 'b-', dashes=[1, 1])
ax1.plot(x, codes_hist_df['min'], 'g-')
ax1.plot(x, random_codes_hist_df['min'], 'g-', dashes=[1, 1])
ax1.plot(x, codes_hist_df['25%'], 'c-')
ax1.plot(x, random_codes_hist_df['25%'], 'c-', dashes=[1, 1])
ax1.plot(x, codes_hist_df['50%'], 'r-')
ax1.plot(x, random_codes_hist_df['50%'], 'r-', dashes=[1, 1])
ax1.plot(x, codes_hist_df['75%'], 'k-')
ax1.plot(x, random_codes_hist_df['75%'], 'k-', dashes=[1, 1])
ax1.plot(x, codes_hist_df['max'], 'm-')
ax1.plot(x, random_codes_hist_df['max'], 'm-', dashes=[1, 1])
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
            'benchmark max'), loc='upper center', ncol=4)

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

fig.savefig('./temp/btc_blocks_hash_sha256_indepedent_vs_random_hash_independent.jpg')
plt.show()
