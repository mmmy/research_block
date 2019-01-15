import React from 'react'
import axios from 'axios'
import { Spin, Pagination, Form, Input, Checkbox, Select, Icon, Button } from 'antd'
import D_func_img from '../../static/D_func.png'
import dfinal_img from '../../static/dfinal.png'

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
      fetch_blocks_pending: true,
      tempRule: {
        unique: true,
        base: 1000,
        count: 100,
      },
      ruels: [],
    }
  }

  componentDidMount() {
    this.fetchBtcBlocks()
  }

  render() {
    const { total, page_size, page, blocks, fetch_blocks_pending, tempRule } = this.state
    return <div className="content-container playground">
      <h2>PlayGround</h2>
      <h3>1.计算至少需要的16进制位数(d_final)</h3>
      <div>
        <img style={{ width: '300px' }} src={D_func_img} />
        <img style={{ width: '250px' }} src={dfinal_img} />
      </div>
      <div>
        <h5>设置取数规则</h5>
        <Form layout="inline">
          <Form.Item
            label="基数"
          >
            <Input style={{ width: '100px' }} size="small" type="number" value={tempRule.base} onChange={this.handleChangeBase.bind(this)} />
          </Form.Item>
          <Form.Item
            label="取数"
          >
            <Input style={{ width: '100px' }} size="small" type="number" value={tempRule.count} onChange={this.handleChangeCount.bind(this)} />
          </Form.Item>
          <Form.Item
          >
            <Checkbox checked={!tempRule.unique} onChange={this.handleChangeUnique.bind(this)}>可重复取数</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button title="添加规则" size="small">
              <Icon type="plus" />
            </Button>
          </Form.Item>
        </Form>
      </div>
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

  handleChangeUnique() {
    const { tempRule } = this.state
    tempRule.unique = !tempRule.unique
    this.setState({})
  }

  handleChangeBase(e) {
    const { tempRule } = this.state
    tempRule.base = e.target.value
    this.setState({})
  }

  handleChangeCount(e) {
    const { tempRule } = this.state
    tempRule.count = e.target.value
    this.setState({})
  }
}
