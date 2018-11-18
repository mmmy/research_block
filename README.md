# 《区块链哈希值生成数列在博彩摇号等行业的应用》
## 统计论证程序参考

## 1 data目录为数据
**btc_blocks548496.csv**
为比特币区块链共538496个区块hash信息，运行data/fetch_blocks.js可以获取，需要安装nodejs相关程序

**uniform_random_hash548496.csv**
为计算机均匀分布随机生成的hash样本，运行data/uniform_random_hash.py,需要安装python相关程序

**two_color_balls_real2340.csv**
为共2340期双色球数据，运行data/fetch_ssq.py即可

以上三个文件都可以运行对应的程序获得，需要注意的是，运行完成之后需要手动去掉多余数据，因为下载的数据量都是超过本文当时研究的时间点。
由于网络原因和api等频率限制，运行程序下载数据需要的时间很长，超过10个小时，所以我已经把处理好的数据上传到网盘：
https://pan.baidu.com/s/1pYAtSHprGPiUnV4bnNUgmw

## 2.统计分布程序示例
以下所有程序的运行结果都已经在results/文件夹下
### 2.1 所有字符出现的频率统计（整体统计检验）
     research_btc_blocks_hash_distribution_all.py
     research_uniform_random_hash_distribution_all.py
     
### 2.2 每一位数的十六进制字符分布（位统计检验）
     research_btc_blocks_hash_distribution_digit.py
     research_uniform_random_hash_distribution_digit.py
     codes_digit_distribution_graph.py
     codes_digit_distribution_stats_graph.py
     
### 2.3	每两位数组合分布（位独立统计检验）
     research_btc_blocks_independent.py              支持断点运行，在一般个人电脑上一共需要运行10小时左右，运行结果可以在results/下找到
     research_uniform_random_independent.py          同上
     codes_product_digit_distribution_stats_graph.py 
     
### 2.4 双色球应用
     two_color_ball_real_graph.py
     app_two_color_balls.py
     app_two_color_balls_graph.py
     
### 3.hash值生成数列参考算法
    javascript版在util.js中，python版在util.py
    以下是python3程序
```python
# 从16进制hash中取出一个数列
# uniq 每个数字是否只能取出一次
# count 取出的数量
def permutation_from_hex(x, base_symbols, uniq, count=-1):
  results = []
  bs = list(base_symbols)
  number = int(x, 16)
  while number > 0:
    m = len(bs)
    if m == 0:
      break
    mod = number % m       # 求余数
    symbol = bs[mod]      # 取数
    number -= mod
    number //= m
    results.append(symbol)
    if count > 0 and len(results) >= count :
      break
    if uniq:               # 不重复取值
      del bs[mod]

  return results, hex(number)
  
  def hex_to_series(x, rules):
    series = []
    for rule in rules:
      results, rest_x = permutation_from_hex(x, rule['symbols'], rule['unique'], rule['count'])
      series.append({
        'symbol_list': results,
        'index_list': [rule['symbols'].index(s) for s in results]
      })
      x = rest_x
    return series
```
生成双色球号码示例
```python
  # 双色球规则： 在16个蓝球中选出一个数字， 在33个红球中选出6个不重复数字
  rules = [
    {  
      'symbols': '0123456789abcdefghijklmnopqrstuvw',
      'unique': True,
      'count': 6
    }, {
      'symbols': '0123456789abcdef',
      'unique': True,
      'count': 1
    }
  ]
  result = hex_to_series('76a914641ad5051edd97029a003fe9efb29359fcee409d88ac', rules)
```
