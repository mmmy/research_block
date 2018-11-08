import numpy as np
import pandas as pd

file = './data/random_hash.csv'

blocks = pd.read_csv(file, header=None, names=['height', 'hash'])