
import React, { Component } from 'react'
import axios from 'axios'
// import {
//   Form, Icon, Input, Button, Checkbox, Notification
// } from 'antd'
import './index.css'
import yuanliImg from '../../static/yuanli.png'

export default class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {
      demos: [],
      blocks: [],
      error: false,
    }
  }

  componentDidMount() {
    axios.get('api/blockchain/btc/dice_demo').then(({ data, status }) => {
      if (status === 200) {
        this.setState({
          demos: data.demos,
          blocks: data.blocks
        })
      } else {
        this.setState({
          error: data
        })
      }
    }).catch(e => {
      this.setState({
        error: e
      })
    })
  }

  render() {
    const { demos, blocks, error } = this.state
    return <div className="home">
      <div>
        <h3>比特币最新区块链数据</h3>
        <p>数据来源<a href="https://www.blockchain.com/zh/api">https://www.blockchain.com/zh/api</a>, 可能会有延迟, 如有错误请反馈邮箱 yqhero@aliyun.com</p>
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
        <br />
        <h2>生成数列示例</h2>
        <p>
          <i>声明：以下生成的数字只供学术论文示例演示作用，不能当做任何性质的博彩应用，请遵守当地法律法规，本站不做任何担保，也不承担任何法律责任！</i>
         
        </p>
        <div>
          {
            demos.map((demo) => {
              const { name, items } = demo
              if (items.length === 0) {
                return
              }
              const { fhashParams, result } = items[0].protocol
              const rules = result.map(r => r.rule)
              return <div className="demo-container">
                <h3>{name}</h3>
                <p>
                  <strong>规则与协议:</strong><br />
                  <strong>F_hash参数: </strong>{`SHA=${fhashParams[0]}, a=${fhashParams[1]}, b=${fhashParams[2]}`}<br />
                  <strong>取数规则Y: </strong>
                  {
                    rules.map(r => {
                      return <ul>
                        <li>{r.unique ? '非重复取数' : '重复取数'}, </li>
                        <li>基数:{r.base}, </li>
                        <li>取数:{r.count}</li>
                      </ul>
                    })
                  }
                  <br />
                </p>
                {this.renderDemoTable(demo)}
                <br />
              </div>
            })
          }
          {
            error && <p style={{color: 'red'}}>如果你看这条消息，说明服务器发生了错误，详情：${JSON.stringify(error)}</p>
          }
        </div>
        <p>如果你想实现或者实验生成别的随机数列, 请跳转到<a href="/playground">PlagGround</a></p>
      </div>
      <br />
      <h2>核心原理说明</h2>
      <p>
        在区块链中每一个区块都有hash值, 是计算机利用SHA(<a href="https://zh.wikipedia.org/wiki/SHA-2">查看维基百科</a>)加密原理生成,
        大部分区块链使用的是sha256。
        sha256是将输入值生成一个范围为0到2的256次方之间的整数，sha512是2的512次方。
        SHA加密具备以下特点：
        <ul>
          <li>相同的输入得到的结果是绝对相同的</li>
          <li>不同的输入得到相同的结果的概率极限趋近于0</li>
          <li>目前的计算机不能反向运算破解的到输入值，只能通过枚举法</li>
          <li>一台常规计算机遍历从0到2的256次方，需要时间超过（1后面50个0）年</li>
        </ul>
      </p>
      <p>
        假如有一个黑箱，里面并不清楚是什么组成的，但是每摇一次，你可以看到一个数字，当摇了很多次比如120次，发现有1,2,3,4,5,6这几个数字，而且每个数字出现的次数接近20，
        那么你会认为这是骰子。当摇了更多次比如10万次，1000万次等，每个数字出现的频率分数为六分之一。那么你可以确信这就是个骰子。
        这是利用统计学原理，归结为在样本容量为多少，误差小于多少的情况下，服从频率均匀分布且前后两次数字独立互不影响的特性，才可以接受这是个6面骰子这个断论。
      </p>
      <p>
        在论文<a href="/paper">《基于区块链hash值生成数列的系统与方法》</a>中做了基本统计来论证我们将原始hash进行线性处理后再进行SHA后的hash值的每一位
        数字的分布服从独立均匀分布的特点。任何人使用任何方法都不能预测未来hash值的任何一位数字。
      </p>
      <h2>生成数列的过程</h2>
      <p>
        <ol>
          <li>确定生成数列的参数规则（是否可重复取数，取数基数，取数个数）组合Y, 比如双色球为Y=[(非重复取数，33,6)，(非重复取数，16,1)]</li>
          <li>确定需要hash的最少16进制位数，具体公式方法参考<a href="/playground">PlayGround</a></li>
          <li>确定将原始hash转换成新的hash的方法F_hash，一般来说线性转换后SHA加密即可，
            以上的示例都是SHA(原始hash * a + b)，即将原始hash乘以a在加b后在进行SHA加密运算</li>
          <li>取余数法，将转化后的hash值根据规则Y生成数列</li>
        </ol>        
      </p>
      <img src={yuanliImg} />
      <br />
      <br />
      <h2>系统特点</h2>
      <p>
        <ul>
          <li>不参与区块链计算，独立于区块链，可以使用任何区块链，如比特币区块链、以太坊区块链等等</li>
          <li>成本低，只需要一台接入互联网的计算机和相应的软件程序</li>
          <li>基于区块链的共识特性，不依赖任何权威部门，生成的结果任何人都可以验证</li>
          <li>无法操纵性</li>
        </ul>
      </p>
      <h2>常见疑惑</h2>
      <p>
        问：区块链遭遇51%算力攻击会有什么影响？<br/>
        答：首先算力越高的区块链，比如比特币区块链，攻击成本非常高，受攻击的都是算力较低的区块链，
        即使受到51%算力攻击，攻击之后生成的区块的hash值也同样是无法预测的，攻击者只是为了实现双花（double-spending）,
        而生成的区块hash值是无法控制的。当然假如我们使用了一个区块之后，刚好发生共攻击，区块被回退了，那么可以有两种解决方式：
        1.使用攻击之前的hash值，2.使用攻击后的hash值。这个规则可以当做一个使用协议即可。
      </p>
      <p>
        问：区块链分叉会有什么影响？<br />
        答：分叉一般区块链升级导致的结果，形成了多条链，链与链之间互不影响，而分叉之前的区块并没有被消除，我们可以使用其中一条链即可。
        所以分叉并不会对系统有什么影响，相反分叉会有更多丰富区块链选择。
      </p>
      <p>
        问：同一个hash值，使用不同F_hash方法之后生成后的hash之间存在关联性，所以生成不同的数列其实是同一套数列？<br/>
        答：的确存在关联性，但是这个关联性无规则的，所以只能用遍历的方式来枚举所有的关联性。事实上目前来说既是世界上所有的计算机联合起来，
        也无法在短时间内遍历完成。所以这个关联性目前来说是无法确定的是随机的。所以认为不同的F_hash生成的数列之间是没有关联性的。
      </p>
    </div>
  }

  renderDemoTable(demo) {
    const items = demo.items
    const id = demo.id
    return <table>
      <thead>
        <tr>
          <th>使用区块数</th>
          <th>区块数据</th>
          <th>生成结果</th>
        </tr>
      </thead>
      <tbody>
        {
          items.map(item => {
            const { protocol, blocks } = item
            let allSymbols = []
            protocol.result.forEach(r => {
              allSymbols = allSymbols.concat(r.symbols)
            })

            return <tr>
              <td>{blocks.length}</td>
              <td>
                <table>
                  <thead>
                    <tr><th>区块高度</th><th>区块生成时间(本地)</th></tr>
                  </thead>
                  <tbody>
                    {
                      blocks.map(b => {
                        const time = new Date(b.time)
                        return <tr><td>{b.height}</td><td>{`${time.toLocaleDateString()} ${time.toLocaleTimeString()}`}</td></tr>
                      })
                    }
                  </tbody>
                </table>
              </td>
              <td>
                <div className={"symbols " + id}>
                  {
                    allSymbols.map(s => {
                      return <span>{s}</span>
                    })
                  }
                </div>
              </td>
            </tr>
          })
        }
      </tbody>
    </table>
  }
}
