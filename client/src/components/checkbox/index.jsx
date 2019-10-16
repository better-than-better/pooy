import React, { useState, useEffect } from 'react';
import Icon from '@components/icon'
import './index.pcss';

const Group = (p) => {
  const props = {...p, children: []};
  const [ value, setValue ] = useState(props.value);

  const handleValue = (e) => {
    const val = e.target.value;

    if (props.onChange) {
      props.onChange(e);
    } else {
      setValue(val);
    }
  };

  p.children.forEach((v) => {
    const child = {...v};

    child.props = {
      ...v.props,
      onChange: handleValue,
      checked: value === v.props.value,
    };

    props.children.push(child);
  });

  useEffect(() => {
    setValue(p.value);
  }, [p.value]);

  return (
    <div className="checkbox-group-wrapper">
      {props.children}
    </div>
  );
};

const Checkbox = (props) => {
  let input = null;
  const [ checked, setChecked ] = useState(props.checked);

  const proxyClick = () => input.click();
  const handleClick = (e) => {
    if (props.onChange) {
      props.onChange({ ...e, target: input });
    } else {
      setChecked(input.checked);
    }
  };

  useEffect(() => {
    setChecked(props.checked);
  }, [props.checked]);
  
  return (
    <div className="checkbox-item" onClick={proxyClick}>
      <Icon type={checked ? 'checkbox-checked' : 'checkbox'} className="checkbox-icon" />
      <input type="checkbox" value={props.value} ref={ref => input = ref} onClick={handleClick} />
      <div className="label">{props.children}</div>
    </div>
  );
};

Checkbox.Group = Group;

export default Checkbox;
