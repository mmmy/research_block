'''
双色球应用
'''
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.gridspec import GridSpec

from btc_blocks import blocks
from util import hash_n, create_hist_pd, stats_data, hex_to_series

# 双色球规则： 在16个蓝球中选出一个数字， 在33个红球中选出6个不重复数字
rules = [
  {  
    'symbols': '0123456789abcdefghijklmnopqrstuvw',
    'unique': True,
    'count': 6
  }, {
    'symbols': '0123456789abcdef',
    'unique': True,
    'count': 1
  }
]

hash_list = blocks.hash
#进行一次sha256
hash_list = [hash_n(h, 1) for h in hash_list]
#出球顺序，从0开始
balls_index_list = [r[0]['index_list'] + r[1]['index_list'] for r in [hex_to_series(h, rules) for h in hash_list]]

r0 = hex_to_series(hash_list[0], rules)
print(r0)
print(balls_index_list[0])
# +1转换成球号
df = pd.DataFrame(balls_index_list, columns=('r1','r2','r3','r4','r5','r6','b1')) + 1

df.to_csv('./temp/btc_548496blocks_hash_sha256_to_two_color_ball.csv')
print('btc_548496blocks_hash_sha256_to_two_color_ball.csv', '保存到temp/')

# 从0开始每100抽取一个， 共抽取2340期
balls_index_list_2340 = balls_index_list[::150][-2340:]
df_2340 = pd.DataFrame(balls_index_list_2340, columns=('r1','r2','r3','r4','r5','r6','b1')) + 1
df_2340.to_csv('./temp/btc_2340blocks_hash_sha256_to_two_color_ball.csv')
print('btc_2340blocks_hash_sha256_to_two_color_ball.csv', '保存到temp/')