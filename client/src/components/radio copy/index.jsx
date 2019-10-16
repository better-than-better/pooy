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
      chekced: value === v.props.value,
    };

    props.children.push(child);
  });

  useEffect(() => {
    setValue(p.value);
  }, [p.value]);

  return (
    <div className="radio-group-wrapper">
      {props.children}
    </div>
  );
};

const Radio = (props) => {
  let input = null;
  const [ chekced, setChecked ] = useState(props.chekced);

  const proxyClick = () => input.click();
  const handleClick = (e) => {
    if (props.onChange) {
      props.onChange({ ...e, target: input });
    } else {
      setChecked(true);
    }
  };

  useEffect(() => {
    setChecked(props.chekced);
  }, [props.chekced])
  
  return (
    <div className="radio-item" onClick={proxyClick}>
      <Icon type={chekced ? 'radio-checked' : 'radio'} className="radio-icon" />
      <input type="radio" value={props.value} ref={ref => input = ref} onClick={handleClick} />
      <div className="label">{props.children}</div>
    </div>
  );
};

Radio.Group = Group;

export default Radio;
