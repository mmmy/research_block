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
print(codes_hist_sum.apply(lambda x:stats.chi2_contingency([x, [2189952]*16]), axis=1))

result = codes_hist_pd.apply(lambda x:stats.chi2_contingency([x, [34281]*16]), axis=1)
print(result)

# plt.bar(sample_hist.index, sample_hist.values)
# plt.show()