'''
获取历史双色球开奖号码
爬虫， 数据可对比官网数据
http://kaijiang.zhcw.com/zhcw/html/ssq/list.html
'''
import requests
from bs4 import BeautifulSoup	#采用BeautifulSoup
import os
import re
import time
import numpy as np
import pandas as pd

def get_page(url):
  headers = {
    'User-Agent':'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6'
  }
  res = requests.get(url, headers=headers)
  return res.text

def get_url(page=1):
  return 'http://kaijiang.zhcw.com/zhcw/html/ssq/list_{}.html'.format(page)

# 提取HTML中双色球数据[[日期，期数，r1,r2,r3,r4,r5,r6,b1]...]
def get_data(html):
  soup = BeautifulSoup(html)
  trs = soup.find_all('tr')
  num_list = []
  for tr in trs:
    tds = tr.find_all('td', {'align':'center'})
    if len(tds) > 3:
      date = tds[0].text
      id = tds[1].text
      ems = tr.find_all('em')
      balls = [em.text for em in ems]
      num_list.append([date, id, *balls])
  return num_list

def fetch_all_data():
  all_data = []
  total_page = 117
  for i in range(total_page):
    print('page', i+1)
    url = get_url(i + 1)
    html = get_page(url)
    page_data = get_data(html)
    all_data = all_data + page_data
    time.sleep(2)
  return all_data

if __name__=="__main__":
  all_data = fetch_all_data()
  df = pd.DataFrame(all_data, columns=('date','id','r1','r2','r3','r4','r5','r6','b1'))
  df.to_csv('two_color_balls_real.csv')
  print('two_color_balls_real.csv', '已保存')