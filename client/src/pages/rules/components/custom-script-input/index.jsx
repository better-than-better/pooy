import React, { useState, useEffect } from 'react';
import Textarea from '@components/textarea';
import Input from '@components/input';
import Icon from '@components/icon';
import ItemRow from '../item-row';
import './index.pcss';

const CustomScriptInput = (props) => {
  const [ value, setValue ] = useState(props.value);

  const updateValue = (val) => {
    if (props.onChange) {
      return props.onChange(val);
    }

    return setValue(val);
  }

  const handleValue = (field, e) => {
    value[field] = e.target.value;
    updateValue({...value});
  };

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return (
    <div className="custom-script-input">
      <ItemRow name="描述">
        <Input placeholder="请输入规则描述" width="640" value={value.desc} onChange={handleValue.bind(null, 'desc')} />
      </ItemRow>
      <ItemRow name="脚本内容">
        <Textarea placeholder="在此编写脚本" width="640" value={value.script} onChange={handleValue.bind(null, 'script')} />
      </ItemRow>
      <a href="https://github.com/better-than-better/pooy-core/blob/master/docs/api.md#proxyuserules" target="_blank" rel="noopener noreferrer">
        <Icon type="wenhao" />
        怎么编写脚本
      </a>
    </div>
  );
};

CustomScriptInput.defaultProps = {
  value: {}
};

export default CustomScriptInput;
