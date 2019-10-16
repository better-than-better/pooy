import React from 'react';
import Input from '@components/input';
import Select from '@components/select';
import Radio from '@components/radio';
import Checkbox from '@components/checkbox';
import Textarea from '@components/textarea';
import HeaderPicker from '@components/header-picker';
import ItemRow from '../item-row';
import './index.pcss';

const Option = Select.Option;

class CustomResponseInput extends React.PureComponent {
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
    let val = e.target ? e.target.value : e;

    if (field === 'bodyType') {
      value.body = '';
    }

    if (['discardOriginalHeaders', 'resDirect'].includes(field)) {
      val = e.target.checked;
    }

    value[field] = val;
    this.updateValue({...value});
  }

  render() {
    const { desc, url, method, headers, bodyType, body, discardOriginalHeaders, resDirect, statusCode } = this.state.value;

    return (
      <div className="custom-response-input">
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
        <ItemRow name="响应体">
          <Radio.Group value={bodyType} onChange={this.handleValue.bind(null, 'bodyType')}>
            <Radio value="text">直接输入</Radio>
            <Radio value="file">选择文件</Radio>
          </Radio.Group>
          {
            bodyType === 'file' && <Input placeholder="请输入文件路径" width="640" value={body} onChange={this.handleValue.bind(null, 'body')} />
          }
          {
            bodyType === 'text'  && <Textarea placeholder="响应体" width="640" value={body} onChange={this.handleValue.bind(null, 'body')} />
          }
          {bodyType !== undefined && <Checkbox checked={resDirect} onChange={this.handleValue.bind(null, 'resDirect')}>直接响应，不请求源地址</Checkbox>}
        </ItemRow>
        <ItemRow name="响应头">
          <HeaderPicker value={headers} onChange={this.handleValue.bind(null, 'headers')} />
          <Checkbox checked={discardOriginalHeaders} onChange={this.handleValue.bind(null, 'discardOriginalHeaders')}>丢弃实际请求头</Checkbox>
        </ItemRow>
        <ItemRow name="状态码">
          <Input placeholder="不填默认200" value={statusCode} onChange={this.handleValue.bind(null, 'statusCode')} />
        </ItemRow>
      </div>
    );
  }
};

CustomResponseInput.defaultProps = {
  value: {}
};

export default CustomResponseInput;
