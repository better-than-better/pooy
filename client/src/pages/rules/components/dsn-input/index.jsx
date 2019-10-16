import React, { useState, useEffect } from 'react';
import Input from '@components/input';
import ItemRow from '../item-row';
import './index.pcss';

const DSNInput = (props) => {
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
    <div className="dns-input">
      <ItemRow name="描述">
        <Input placeholder="请输入规则描述" width="640" value={value.desc} onChange={handleValue.bind(null, 'desc')} />
      </ItemRow>
      <ItemRow name="域名">
        <Input placeholder="请输入需要解析的域名" width="640" value={value.hostname} onChange={handleValue.bind(null, 'hostname')} />
      </ItemRow>
      <ItemRow name="IP">
        <Input placeholder="请输入解析的目标 IP" width="640" value={value.ip} onChange={handleValue.bind(null, 'ip')} />
      </ItemRow>
    </div>
  );
};

DSNInput.defaultProps = {
  value: {}
};

export default DSNInput;
