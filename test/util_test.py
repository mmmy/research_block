import os, sys
lib_path = os.path.abspath(os.path.join('..'))
sys.path.append(lib_path)

from util import hex_to_base_n, permutation_from_hex

symbols33 = '0123456789abcdefghijklmnopqrstuvw'
symbols16 = '0123456789abcdef'
hex64 = '8d98fb67850b4fd740330f2e5067595962c61ac86a3358ba5a4de55e66ff5704'

base16 = hex_to_base_n(hex64, symbols16)
base16.reverse()
assert(hex64 == ''.join(base16))

base33 = hex_to_base_n(hex64, symbols33)

permutation = permutation_from_hex(hex64, symbols33, False)

assert(base33 == permutation[0])

uniq_results, reset_x = permutation_from_hex(hex64, symbols16, True, 33)
uniq_results.reverse()
print(''.join(uniq_results))