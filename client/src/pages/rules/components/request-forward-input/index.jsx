import React from 'react';
import Input from '@components/input';
import Select from '@components/select';
import ItemRow from '../item-row';
import './index.pcss';

const Option = Select.Option;

class RequestForwardInput extends React.PureComponent {

  state = {
    value: this.props.value
  }

  static getDerivedStateFromProps({ value, onChange }, state) {
    if (value !== state.value && onChange) return { value };

    return null;
  }

  updateValue = (() => {
    if (this.props.onChange) {
      return this.props.onChange;
    }

    return (value) => {
      this.setState({ value });
    }
  })()

  handleValue = (field, e) => {
    const { value } = this.state;
    const val = e.target ? e.target.value : e;

    if (field === 'bodyType') {
      value.body = '';
    }

    value[field] = val;
    this.updateValue({...value});
  }

  render() {
    const { desc, url, method, forwardPath } = this.state.value;

    return (
      <div className="request-forward-input">
        <ItemRow name="描述">
          <Input width="640" placeholder="规则描述" value={desc} onChange={this.handleValue.bind(null, 'desc')} />
        </ItemRow>
        <ItemRow name="匹配规则">
          <Input width="640" placeholder="输入URL" value={url} onChange={this.handleValue.bind(null, 'url')} />
        </ItemRow>
        <ItemRow name="请求方法">
          <Select width="640" placeholder="请选择请求方法" multiple value={method} onChange={this.handleValue.bind(null, 'method')} >
            <Option value="get">GET</Option>
            <Option value="post">POST</Option>
            <Option value="put">PUT</Option>
            <Option value="del">DELETE</Option>
            <Option value="options">OPTIONS</Option>
            <Option value="head">HEAD</Option>
            <Option value="connect">CONNECT</Option>
            <Option value="trace">TRACE</Option>
            <Option value="path">PATH</Option>
          </Select>
        </ItemRow>
        <ItemRow name="转发路径">
          <Input
            width="640"
            placeholder="请输入转发路径, 本地文件路径或者远程地址 eg: https://baidu.com or /User/hello/world.txt"
            value={forwardPath}
            onChange={this.handleValue.bind(null, 'forwardPath')}
          />
        </ItemRow>
      </div>
    );
  }
}

RequestForwardInput.defaultProps = {
  value: {}
};

export default RequestForwardInput;
