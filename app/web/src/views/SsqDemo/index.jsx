import React from 'react'
import axios from 'axios'
import { Pagination, Spin } from 'antd'

import './index.css'

export default class SsqDemo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ssq: {
        page: 1,
        page_size: 10,
        total: 0,
        list: [],
        pending: true,
      },
      ssq_btc: {
        page: 1,
        page_size: 10,
        total: 0,
        list: [],
        pending: true,
      },
    }
  }

  componentDidMount() {
    this.fetchSsqDemo('ssq')
    this.fetchSsqDemo('ssq_btc')
  }

  render() {
    const { ssq, ssq_btc } = this.state
    return <div className="content-container ssq-demo">
      <h2>双色球示例</h2>
      <p>
        比特币区块链是从2009/01/03为第一个区块，从2009/01/09开始运行；<br />
        双色球是从2003年开始，每周两期，北京时间21:15开奖;<br />
        所以以下从2009/01/09开始，取真实双色球开奖时间(北京时间21:15)后的第一区块来生成双色球号码，并进行统计对比
      </p>
      <h3>区块链hash值生成号码 <a style={{fontSize: '14px'}} target="_blank" href="/benchmark/ssq_btc.csv">下载全部csv数据</a></h3>
      <div style={{ display: 'inline-block', position:'relative' }}>
        {this.renderDataTable(ssq_btc)}
        {ssq_btc.pending && <div className="spin-container"><Spin /></div>}
      </div>
      <Pagination size="small" current={ssq_btc.page} pageSize={ssq_btc.page_size} total={ssq_btc.total}
        showQuickJumper showSizeChanger showTotal={total => `共${total}条记录`}
        onShowSizeChange={this.handleSelectPage.bind(this, 'ssq_btc')}
        onChange={this.handleSelectPage.bind(this, 'ssq_btc')}
      />
      <br />
      <h3>真实双色球号码 <a style={{fontSize: '14px'}} target="_blank" href="/benchmark/ssq.csv">下载全部csv数据</a></h3>
      <div style={{ display: 'inline-block', position: 'relative' }}>
        {this.renderDataTable(ssq)}
        {ssq.pending && <div className="spin-container"><Spin /></div>}
      </div>
      <Pagination size="small" current={ssq.page} pageSize={ssq.page_size} total={ssq.total}
        showQuickJumper showSizeChanger showTotal={total => `共${total}条记录`}
        onShowSizeChange={this.handleSelectPage.bind(this, 'ssq')}
        onChange={this.handleSelectPage.bind(this, 'ssq')}
      />
      <br />
      <h2>统计分布对比</h2>
      <img src="/benchmark/ssq_btc_stats.png"/>
      <img src="/benchmark/ssq_stats.png"/>
    </div>
  }

  fetchSsqDemo(key = 'ssq') {
    const { page, page_size } = this.state[key]
    this.state[key].pending = true
    this.setState({})
    axios.post(`/api/full_demo/${key}`, { page, page_size }).then(({ data, status }) => {
      if (status === 200) {
        this.setState({
          [key]: {
            ...this.state[key],
            ...data.data,
            pending: false,
          }
        })
      } else {
        this.setState({
          [key]: {
            ...this.state[key],
            list: [],
            pending: false,
          }
        })
      }
    }).catch(e => {
      this.setState({
        [key]: {
          ...this.state[key],
          list: [],
          pending: false,
        }
      })
    })
  }

  renderDataTable(data) {
    const { list } = data
    return <table className="ssq-data-table">
      <thead>
        <tr><th>期号</th><th>日期</th><th>号码</th></tr>
      </thead>
      <tbody>
        {
          list.map(item => {
            return <tr>
              <th>{item.id}</th>
              <th>{item.date}</th>
              <th className="numbers">
                <span>{item.r1}</span>
                <span>{item.r2}</span>
                <span>{item.r3}</span>
                <span>{item.r4}</span>
                <span>{item.r5}</span>
                <span>{item.r6}</span>
                <span>{item.b1}</span>
              </th>
            </tr>
          })
        }
      </tbody>
    </table>
  }

  handleSelectPage(key, current, page_size) {
    console.log(current, page_size)
    this.setState({
      [key]: {
        ...this.state[key],
        page: current,
        page_size,
      }
    }, () => {
      this.fetchSsqDemo(key)
    })
  }
}
