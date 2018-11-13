import numpy as np
import pandas as pd

file = './data/uniform_random_hash548496.csv'

blocks = pd.read_csv(file, header=None, names=['height', 'hash'])