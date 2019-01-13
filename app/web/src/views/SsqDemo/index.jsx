import React from 'react'
import axios from 'axios'

import './index.css'

export default class SsqDemo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 1,
      page_size: 20,
      total: 0,
      ssq: [],
      ssq_btc: [],
      pending: true,
      error: false,
    }
  }
  
  componentDidMount() {
    this.fetchSsqDemo()
  }

  render() {
    const { ssq, ssq_btc } = this.state
    return <div className="ssq-demo">
      {JSON.stringify(ssq)}
      {JSON.stringify(ssq_btc)}
    </div>
  }

  fetchSsqDemo() {
    const { page, page_size } = this.state
    axios.post('/api/full_demo/ssq', {page, page_size}).then(({ data, status }) => {
      if (status === 200) {
        this.setState({
          ssq: data.ssq.list,
          ssq_btc: data.ssq_btc.list,
          total: Math.max(data.ssq.total, data.ssq_btc.total),
          pending: false,
          error: false
        })
      } else {
        this.setState({
          ssq: [],
          ssq_btc: [],
          pending: false,
          error: data
        })
      }
    }).catch(e => {
      this.setState({
        ssq: [],
        ssq_btc: [],
        pending: false,
        error: e
      })
    })
  }
}
