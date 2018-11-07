#python 3.6
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import scipy.stats as stats

symbols = '0123456789abcdef'
def random_symbol():
  return symbols[np.random.randint(0,16)]

def sample():
  return [random_symbol() for i in range(548496)]

sample_hist = [pd.Series(sample()).value_counts().sort_index(axis=0) for i in range(64)]
codes_hist_pd = pd.DataFrame(sample_hist)
codes_hist_sum = codes_hist_pd.apply(np.sum)
print(stats.chi2_contingency([codes_hist_sum.values, [2189952]*16]))

result = codes_hist_pd.apply(lambda x:stats.chi2_contingency([x, [34281]*16]), axis=1)
# result = codes_hist_pd.apply(lambda x:stats.chisquare(x), axis=1)
print(result)

mean = codes_hist_pd.mean(axis=1)
std = codes_hist_pd.std(axis=1)
chi2 = [s[0] for s in result]
pvalue = [s[1] for s in result]

codes_hist_pd['mean'] = mean
codes_hist_pd['std'] = std
# print(chi2)
codes_hist_pd['chi2'] = chi2
codes_hist_pd['pvalue'] = pvalue
codes_hist_pd.to_csv('./temp/random_codes_hist1.csv')

# plt.bar(sample_hist.index, sample_hist.values)
# plt.show()