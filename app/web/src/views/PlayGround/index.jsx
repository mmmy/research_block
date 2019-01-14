import React from 'react'
import axios from 'axios'
import { Spin, Pagination } from 'antd'

import './index.css'

export default class PlayGround extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 1,
      page_size: 10,
      total: 0,
      blocks: [],
      fetch_blocks_error: 0,
      fetch_blocks_pending: true
    }
  }

  componentDidMount() {
    this.fetchBtcBlocks()
  }

  render() {
    const { total, page_size, page, blocks, fetch_blocks_pending } = this.state
    return <div className="content-container playground">
      <h2>PlayGround</h2>
      <h4>比特币区块链区块信息</h4>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <table>
          <thead><tr><th>区块高度</th><th>区块ISO时间(0区时)</th><th>区块本地时间</th><th>hash(64位十六进制)</th></tr></thead>
          <tbody>
            {
              blocks.map(b => {
                const time = new Date(b.time)
                return <tr><td>{b.height}</td><td>{b.time}</td><td>{`${time.toLocaleDateString()} ${time.toLocaleTimeString()}`}</td><td>{b.hash}</td></tr>
              })
            }
          </tbody>
        </table>
        {
          fetch_blocks_pending && <div className="spin-container"><Spin /></div>
        }
      </div>
      <Pagination size="small" current={page} pageSize={page_size} total={total} showSizeChanger showQuickJumper showTotal={total => `共${total}条记录`} onChange={this.handleChangePage.bind(this)} onShowSizeChange={this.handleChangePageSize.bind(this)} />
      <div>

      </div>
    </div>
  }

  fetchBtcBlocks() {
    const { page, page_size } = this.state
    this.setState({
      fetch_blocks_pending: true
    })
    axios.post('/api/blockchain/btc', { page, page_size }).then(({ data, status }) => {
      if (status === 200) {
        this.setState({
          total: data.total,
          blocks: data.blocks,
          fetch_blocks_pending: false,
          fetch_blocks_error: false
        })
      } else {
        this.setState({
          blocks: [],
          fetch_blocks_pending: false,
          fetch_blocks_error: data,
        })
      }
    }).catch(e => {
      this.setState({
        fetch_blocks_pending: false,
        fetch_blocks_error: e,
      })
    })
  }

  handleChangePage(page, page_size) {
    this.setState({
      page,
      page_size
    }, () => {
      this.fetchBtcBlocks()
    })
  }

  handleChangePageSize(current, size) {
    this.setState({
      page_size: size
    }, () => {
      this.fetchBtcBlocks()
    })
  }
}
