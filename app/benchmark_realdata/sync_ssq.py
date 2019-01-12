'''
获取历史双色球开奖号码
爬虫， 数据可对比官网数据
http://kaijiang.zhcw.com/zhcw/html/ssq/list.html
'''
from db import get_lastest_ssq, write_ssq_data
import requests
from bs4 import BeautifulSoup	#采用BeautifulSoup
import os
import re
import time
import numpy as np
import pandas as pd
import dateutil.parser
from datetime import datetime

def get_page(url):
  headers = {
    'User-Agent':'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6'
  }
  res = requests.get(url, headers=headers)
  return res.text

def get_url(page=1):
  return 'http://kaijiang.zhcw.com/zhcw/html/ssq/list_{}.html'.format(page)

def get_total_page():
  html = get_page(get_url())
  soup = BeautifulSoup(html, 'html.parser')
  return int(soup.find('p', {'class':'pg'}).find('strong').text)

# 提取HTML中双色球数据[[日期，期数，r1,r2,r3,r4,r5,r6,b1]...]
def get_data(html):
  soup = BeautifulSoup(html, 'html.parser')
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

def fetch_all_data(from_timestamp=0):
  all_data = []
  total_page = get_total_page()

  # print(from_timestamp and datetime.fromtimestamp(from_timestamp))
  # print('total_page',total_page)

  for i in range(total_page):
    # print('page', i+1)
    url = get_url(i + 1)
    html = get_page(url)
    page_data = get_data(html)
    for item in page_data:
      date = item[0]
      date_time = dateutil.parser.parse(date)
      if date_time.timestamp() > from_timestamp:
        all_data.append(item)
      else:
        print('find all date success and finish')
        return all_data

    time.sleep(2)
  return all_data

# if __name__=="__main__":
#   all_data = fetch_all_data()
#   df = pd.DataFrame(all_data, columns=('date','id','r1','r2','r3','r4','r5','r6','b1'))
#   df.to_csv('two_color_balls_real.csv')
#   print('two_color_balls_real.csv', '已保存')
# def crawl_ssq_data(from_date):

def sync_ssq():
  last_ssq = get_lastest_ssq()
  data_to_write = []
  if len(last_ssq) == 0:
    data_to_write = fetch_all_data(0)
  else:
    last_date = list(last_ssq)[0][0]['time']
    time_stamp = dateutil.parser.parse(last_date).timestamp()
    data_to_write = fetch_all_data(time_stamp)
  
  print('sync_ssq data and write poinsts', len(data_to_write))
  write_ssq_data(data_to_write)