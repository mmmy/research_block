import React from 'react'
import axios from 'axios'
import AddRule from '../components/AddRule'
import { Spin, Pagination, Tag, Form, Input, Checkbox, Select, Icon, Button } from 'antd'
import D_func_img from '../../static/D_func.png'
import dfinal_img from '../../static/dfinal.png'
import { calcDmin } from '../../helpers/calcDmin'

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
      rules: [{ unique: false, base: 22, count: 5 }],
    }
  }

  componentDidMount() {
    this.fetchBtcBlocks()
  }

  render() {
    const { total, page_size, page, blocks, fetch_blocks_pending, rules } = this.state
    const d_final = calcDmin(rules)
    return <div className="content-container playground">
      <h2>PlayGround</h2>
      <h3>1.计算至少需要的16进制位数(d_final)</h3>
      <div className="border dashed">
        <h5>公式参考</h5>
        <img style={{ width: '250px', marginRight: '10px' }} src={dfinal_img} />
        其中:
        <img style={{ width: '300px' }} src={D_func_img} />
      </div>
      <br />
      <div className="border dashed">
        <h5>设置取数规则</h5>
        <AddRule onAdd={this.handleAddRule.bind(this)} />
        <ol className="rules-list" style={{ fontSize: '14px', fontWeight: 'bold' }}>
          {
            rules.map((rule, i) => {
              return <li>(<span>{rule.unique ? '重复取数' : '非重复取数'}</span>,&nbsp;
                <span>{rule.base}</span>,&nbsp;
                <span>{rule.count}</span>)&nbsp;
                <Button shape="circle" size="small" type="danger" icon="delete" onClick={this.handleDeleteRule.bind(this, i)}></Button>
              </li>
            })
          }
        </ol>
        <p>d_final = <strong>{d_final.toFixed(2)}</strong> =(向上取整)=> <span style={{fontSize: '24px', color: 'blue'}}>{Math.ceil(d_final)}</span>
        </p>
      </div>
      <br />
      <h3>2.设置处理过程规则</h3>
      <p><i>生成更多hash位数有两种方式，这里只演示1个hash值，多个F_hash函数组合的方式</i></p>
      <div className="border dashed">
        <h4>设置F_hash参数</h4>
        <p><i>理论上处理原始hash的方式可以完全自定义，只要处理后的hash在统计上符合各个数位服从独立均匀分布的特点即可，
          只是更通常易于理解的是转换方式是先线性转换，然后SHA</i></p>
        <p><i>*所以这里使用的是 <strong>F_hash = SHA(原始hash * a + b)</strong></i></p>
        
      </div>
      <br />
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

  handleAddRule(rule) {
    this.state.rules.push(rule)
    this.setState({})
  }

  handleDeleteRule(index) {
    this.state.rules.splice(index, 1)
    this.setState({})
  }
}
