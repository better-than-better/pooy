import React from 'react';
import DNSInput from '../../components/dsn-input';
import RequestForwardInput from '../../components/request-forward-input';
import CustomResponseInput from '../../components/custom-response-input';
import CustomScriptInput from '../../components/custom-script-input';
import './index.pcss';

class RulePicker extends React.PureComponent {
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

  handleValue = (val) => {
    this.updateValue(val);
  }

  render() {
    const { type } = this.props;
    const { value } = this.state;

    const inputEnum = {
      0: <DNSInput value={value} onChange={this.handleValue} />,
      1: <RequestForwardInput value={value} onChange={this.handleValue} />,
      2: <CustomResponseInput value={value} onChange={this.handleValue} />,
      3: <CustomScriptInput value={value} onChange={this.handleValue} />
    };

    return (
      <div className="rule-picker-wrapper">
        {inputEnum[type]}
      </div>
    );
  }
}

export default RulePicker;
