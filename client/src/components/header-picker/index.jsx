import React, { useState, useEffect } from 'react';
import Input from '@components/input';
import Icon from '@components/icon';
import './index.pcss';

const filterValue = (val) => {
  return val.map(v => v._id ? v : ({ ...v, _id: Math.random().toString(36).slice(2) }));
};

const HeaderPicker = (props) => {
  const [ value, setValue ] = useState(filterValue(props.value));

  const updateValue = (val) => {
    const { onChange } = props;

    return onChange ? onChange([...val]) : setValue([...val]);
  };

  const addItem = () => {
    value.push({ _id: Math.random().toString(36).slice(2) });
    updateValue(value);
  };

  const delItem = (i) => {
    value.splice(i, 1);
    updateValue(value);
  };

  const handleKey = (index, e) => {
    value[index].key = e.target.value;
    updateValue(value);
  };

  const handleValue = (index, e) => {
    value[index].value = e.target.value;
    updateValue(value);
  };

  useEffect(() => {
    setValue(filterValue(props.value));
  }, [props.value]);

  return (
    <div className="header-picker">
      {
        value.map((v, i) => (
          <div className="item" key={v._id}>
            <Input onChange={handleKey.bind(null, i)} value={v.key} placeholder="key" />
            <Input onChange={handleValue.bind(null, i)} value={v.value} placeholder="value" />
            {i === 0 ? <Icon type="add" onClick={addItem} /> : <Icon type="del" onClick={delItem.bind(null, i)} />}
          </div>
        ))
      }
    </div>
  );
};

HeaderPicker.defaultProps = {
  value: [{}]
};

export default HeaderPicker;
