import React from 'react'
import { Form, Input, Button, Checkbox, Icon, InputNumber } from 'antd'

class AddRule extends React.Component {
  state = {
    unique: true,
    base: 1000,
    count: 100,
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return <div>
      <Form layout="inline">
        <Form.Item
          label="基数"
        >
          {
            getFieldDecorator('base', {
              initialValue: 1000,
              rules: [{
                required: true,
              }]
            })(<InputNumber style={{ width: '100px' }} size="small" min={1} />)
          }
        </Form.Item>
        <Form.Item
          label="取数"
        >
          {
            getFieldDecorator('count', {
              initialValue: 100,
              rules: [{
                required: true,
              }]
            })(<InputNumber style={{ width: '100px' }} size="small" min={1} />)
          }
        </Form.Item>
        <Form.Item
        >
          {
            getFieldDecorator('unique', {
              initialValue: false,
            })(
              <Checkbox>可重复取数</Checkbox>
            )
          }
        </Form.Item>
        <Form.Item>
          <Button title="添加规则" size="small" onClick={this.handleAddRule.bind(this)}>
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

export default Form.create()(AddRule)
