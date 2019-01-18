import React from 'react'
import { Form, Button, Icon, InputNumber, Select } from 'antd'

class HashConfig extends React.Component {
  state = {

  }
  render() {
    const { getFieldDecorator } = this.props.form
    return <div>
      <Form layout="inline">
        <Form.Item
          label="SHA"
        >
          {
            getFieldDecorator('sha', {
              initialValue: 'sha512',
              rules: [{
                required: true,
              }]
            })(<Select>
              <Select.Option value="sha256">sha256</Select.Option>
              <Select.Option value="sha512">sha512</Select.Option>
            </Select>)
          }
        </Form.Item>
        <Form.Item
          label="a"
        >
          {
            getFieldDecorator('a', {
              initialValue: 1,
              rules: [{
                required: true,
              }]
            })(<InputNumber style={{ width: '50px' }} size="small" min={1} max={99999} precision={0}/>)
          }
        </Form.Item>
        <Form.Item
          label="b"
        >
          {
            getFieldDecorator('b', {
              initialValue: 1,
              rules: [{
                required: true,
              }]
            })(<InputNumber style={{ width: '50px' }} size="small" />)
          }
        </Form.Item>
        <Form.Item>
          <Button title="添加规则" size="small" onClick={this.handleAddRule.bind(this)} precision={0}>
            <Icon type="plus" />
          </Button>
        </Form.Item>
      </Form>
    </div>
  }

  handleAddRule() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onAdd(values)
      }
    })
  }
}

export default Form.create()(HashConfig)
