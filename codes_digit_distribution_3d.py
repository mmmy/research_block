import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib as mpl
from mpl_toolkits.mplot3d import Axes3D
'''
codes_hist_file = './results/BTC_548496blocks_hash_sha256_codes_digit_distribution.csv'
codes_hist_df = pd.read_csv(codes_hist_file, index_col=0)

print(codes_hist_df)
'''
fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
ax.bar3d([1,2],[1,2],[0,0],1,1,[20,10])
plt.show()