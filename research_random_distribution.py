#python 3.6
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import scipy.stats as stats
from blocks_random import blocks
from util import  create_hist_pd, stats_data

hash_list = blocks.hash
codes = [list(h) for h in hash_list]

codes_hist, codes_hist_pd = create_hist_pd(codes)
codes_hist_sum = codes_hist_pd.apply(np.sum)

print(stats.chi2_contingency([codes_hist_sum.values, [2189952]*16]))

codes_hist_pd_stats = stats_data(codes_hist_pd)

codes_hist_pd_stats.to_csv('./temp/random_codes_hist2.csv')

# plt.bar(sample_hist.index, sample_hist.values)
# plt.show()