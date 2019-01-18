import React from 'react'
import axios from 'axios'
import AddRule from '../components/AddRule'
import HashConfig from '../components/HashConfig'
import { Spin, Pagination, Tag, Form, Input, Checkbox, Select, Icon, Button, notification } from 'antd'
import D_func_img from '../../static/D_func.png'
import dfinal_img from '../../static/dfinal.png'
import { calcDmin } from '../../helpers/calcDmin'

import './index.css'

function calcFhashDs(fhash) {
  if (fhash.sha === 'sha256') {
    return 64
  } else if (fhash.sha === 'sha512') {
    return 128
  }
  return 0
}

function calcFhashesDs(fhashes) {
  let total = 0
  fhashes.forEach(f => {
    total += calcFhashDs(f)
  })
  return total
}

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
      rules: [{ unique: false, base: 100, count: 50 }, { unique: false, base: 33, count: 6 }],
      fhashes: [{ sha: 'sha512', a: 1, b: 0 }],
      sourceHash: '00000000000000000025bc0bcc1a4a97be9dabc9b7c5d7dceb5f433f3aedfad4',
      result: null,
      fetch_result_loading: false,
    }
    // 数字很大的时候计算会很久，所以不要每次渲染都计算
    this.d_final = calcDmin(this.state.rules)
  }

  componentDidMount() {
    this.fetchBtcBlocks()
    this.handleFetchResult()
  }

  render() {
    const { total, page_size, page, blocks, fetch_blocks_pending, result, rules, fhashes, sourceHash, fetch_result_loading } = this.state
    const dfinalInt = Math.ceil(this.d_final)

    const fhashesTotal = this.getFhashedTotal()

    return <div className="content-container playground">
      <h2>PlayGround</h2>
      <br />
      <h3>1.设置取数规则，计算至少需要的16进制位数(d_final)</h3>
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
        <p>d_final = <strong>{this.d_final.toFixed(2)}</strong> =(向上取整)=> <span style={{fontSize: '24px', color: 'blue'}}>{dfinalInt}</span>
        </p>
      </div>
      <br />
      <h3>2.输入原始hash</h3>
      <div style={{fontSize: '12px'}}><i>理论上可以输入任何字符，但请最好输入一个64位的16进制值, 可以参考复制页面底部的<a href="#cankao-hash">比特币区块链数据</a></i></div>
      <Input value={sourceHash} type="text" size="small" onChange={this.handleChangeHash.bind(this)}/>
      <br/>
      <br/>
      <h3>3.设置处理过程规则</h3>
      <p><i>生成更多hash位数有两种方式，这里只演示1个hash值，多个F_hash函数组合的方式</i></p>
      <div className="border dashed">
        <h4>设置F_hash参数</h4>
        <p><i>理论上处理原始hash的方式可以完全自定义，只要处理后的hash在统计上符合各个数位服从独立均匀分布的特点即可，
          只是更通常易于理解的是转换方式是先线性转换，然后SHA</i></p>
        <p><i>*所以这里使用的是 <strong>F_hash = SHA(原始hash * a + b)</strong></i></p>
        <HashConfig onAdd={this.handleAddFhash.bind(this)} />
        <div style={{fontSize: '12px'}}><i>*顺序不一样，结果会不一样</i></div>
        <ol className="rules-list" style={{ fontSize: '14px', fontWeight: 'bold' }}>
          {
            fhashes.map((f, i) => {
              return <li>
                {f.sha}(hash * {f.a} + {f.b})&nbsp;==>生成 {calcFhashDs(f)} 位新hash&nbsp;
                <Button shape="circle" size="small" type="danger" icon="delete" onClick={this.handleDeleteFhash.bind(this, i)}></Button>
              </li>
            })
          }
        </ol>
        <p>
          <Icon theme="filled" style={{color: fhashesTotal >= dfinalInt ? "green" : 'red', fontSize: '20px' }} type={fhashesTotal >= dfinalInt ? "check-circle" : "exclamation-circle"} />
          共能产生<strong>{fhashesTotal}</strong>位hash, {fhashesTotal >= dfinalInt ? '能' : '不能'}满足第一步所需要的<strong>{dfinalInt}</strong>位</p>
      </div>
      <br />
      <div>
        <Button loading={fetch_result_loading} type="primary" onClick={this.handleFetchResult.bind(this)}>生成结果</Button>
      </div>
      <br />   
      <div className="hash-result-container">
        {
          result && result.map((item, i) => {
            const rule = item.rule
            return <div className="rule-row">
              <h6>{i + 1}.({rule.unique ? '重复取数' : '非重复取数'}, {rule.base}, {rule.count})</h6>
              <div className="border dashed symbols clearfix">
                {
                  item.symbols.map(s => {
                    return <span className="symbol">{s}</span>
                  })
                }
              </div>
            </div>
          })
        }
      </div>
      <br />
      <h4 id="cankao-hash">参考hash值：比特币区块链区块信息</h4>
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
    this.d_final = calcDmin(this.state.rules)
    this.setState({})
  }

  handleDeleteRule(index) {
    this.state.rules.splice(index, 1)
    this.setState({})
  }

  handleAddFhash(param) {
    const { fhashes } = this.state
    for (let i=0; i<fhashes.length; i++) {
      const f = fhashes[i]
      if (f.sha === param.sha && f.a === param.a && f.b === param.b) {
        notification.warn({
          message: '>_< 不能添加重复fhash'
        })
        return
      }
    }
    this.state.fhashes.push(param)
    this.setState({})
  }
  
  handleDeleteFhash(index) {
    this.state.fhashes.splice(index, 1)
    this.setState({})
  }

  handleChangeHash(e) {
    this.setState({
      sourceHash: e.target.value
    })
  }

  getFhashedTotal() {
    return calcFhashesDs(this.state.fhashes)
  }

  handleFetchResult() {
    const data = {
      hashes: [this.state.sourceHash],
      fhashes: this.state.fhashes.map(f => [f.sha, f.a, f.b]),
      rules: this.state.rules,
    }
    this.setState({
      fetch_result_loading: true,
      data: [],
    })
    axios.post('/api/blockchain/demo/playground', data).then(({data, status}) => {
      this.setState({
        fetch_result_loading: false
      })
      if (status === 200) {
        this.setState({
          result: data.data
        })
      }
    }).catch(e => {
      this.setState({
        fetch_result_loading: false
      })
      notification.error({
        message: '失败',
        description: e && e.toString(),
      })
    })
  }
}
