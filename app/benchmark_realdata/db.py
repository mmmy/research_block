from influxdb import InfluxDBClient
import dateutil.parser

blockchain_client = InfluxDBClient('localhost', 8086, database='blockchain')
bocai_client = InfluxDBClient('localhost', 8086, database='bocai')

def get_lastest_ssq():
  rows = bocai_client.query('select * from ssq order by time desc limit 1')
  return rows

def write_ssq_data(data):
  points = [{
    'measurement': 'ssq',
    'fields': {
      'date': item[0],
      'id': item[1],
      'r1': item[2],
      'r2': item[3],
      'r3': item[4],
      'r4': item[5],
      'r5': item[6],
      'r6': item[7],
      'b1': item[8]
    },
    'time': item[0]
  } for item in data]
  bocai_client.write_points(points)