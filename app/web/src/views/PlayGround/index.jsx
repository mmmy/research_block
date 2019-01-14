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
    const { total, page_size, page } = this.state
    return <div className="playground">
      <Pagination size="small" current={page} pageSize={page_size} total={total} showSizeChanger showQuickJumper showTotal={total => `共${total}条记录`} onChange={this.handleChangePage.bind(this)} onShowSizeChange={this.handleChangePageSize.bind(this)}/>
      <div>
        
      </div>
    </div>
  }

  fetchBtcBlocks() {
    const { page, page_size } = this.state
    axios.post('/api/blockchain/btc', {page, page_size}).then(({data, status}) => {
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
