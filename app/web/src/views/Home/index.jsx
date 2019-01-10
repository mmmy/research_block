
import React, { Component } from 'react'
import axios from 'axios'
import {
  Form, Icon, Input, Button, Checkbox, Notification
} from 'antd'

export default class Home extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      demos: []
    }
  }

  componentDidMount() {
    axios.get('/blockchain/btc/dice_demo').then(({ data, status }) => {
      if (status === 200) {
        this.setState({
          demos: data.demos
        })
      } else {
        console.log('error', data)
      }
    }).catch(e => {
      console.log('error', e)
    })
  }

  render() {
    const { demos } = this.state
    return  <div className="home">
      <div>{JSON.stringify(demos || [])}</div>
      <Form>
        <label>选择起始高度</label>
        <Form.Item>

        </Form.Item>
      </Form>
      <Form>
        <label>选择协议</label>
        <Form.Item>
          
        </Form.Item>
      </Form>
    </div>
  }
}
