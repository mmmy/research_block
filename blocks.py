import numpy as np
import pandas as pd

file = './data/blocks548496.csv'

blocks = pd.read_csv(file, header=None, names=['height', 'time', 'hash', 'main_chain'])