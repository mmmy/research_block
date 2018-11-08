
import numpy as np
import pandas as pd

data_len = 548496
symbols = '0123456789abcdef'
symbols_len = len(symbols)

def random_hash(l=64):
  s_list = [symbols[np.random.randint(symbols_len)] for i in range(l)]
  return ''.join(s_list)

hash_list = [random_hash() for i in range(data_len)]
pd.Series(hash_list).to_csv('./random_hash.csv')
