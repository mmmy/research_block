
import hashlib

def hash_n(str, times=1):
  result = str
  while times > 0:
    result = hashlib.sha256(result.encode('utf-8')).hexdigest()
    times-=1
  return result

