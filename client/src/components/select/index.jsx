import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Icon from '@components/icon';
import './index.pcss';

const Option = ({ value, selected, children, onClick }) => {
  return (
    <div className={`option ${selected ? 'selected' : ''}`} onClick={onClick} value={value}>{children.toString()}</div>
  );
};

Option.propTypes = {
  children: PropTypes.string
};

const Select = (p) => {
  const props = {...p, children: [] };
  const [ active, setActive ] = useState(false);
  const [ value, setValue ] = useState(props.value);

  const filterName = (val) => {
    const option = p.children.find(v => v.props.value === val);

    return option ? option.props.children.toString() : ''
  };

  const toggleActive = (e) => {
    e.stopPropagation();
    setActive(!active);
  };

  const handleClick = (e) => {
    setActive(false);
  };

  const handleValue = (val) => {
    if (props.onChange) {
      props.onChange(val);
    } else {
      setValue(val);
    }
  };

  p.children.forEach((v) => {
    const child = {...v};

    child.props = {
      ...v.props,
      onClick: handleValue.bind(null, v.props.value),
      selected: value === v.props.value,
    };

    props.children.push(child);
  });

  useEffect(() => {
    setValue(props.value);
    window.addEventListener('click', handleClick, false);

    return () => {
      window.removeEventListener('click', handleClick, false);
    };
  }, [props.value]);

  return (
    <div className={`pooy-select ${active ? 'active' : ''}`}>
      <div className="select-val" onClick={toggleActive}>
        {value ? filterName(value) : p.placeholder}
        <Icon type="down" />
      </div>
      {active && <div className="select-options">
        {props.children}
      </div>}
    </div>
  );
};

Select.Option = Option;

Select.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string
};

Select.defaultProps = {
  placeholder: '请选择'
};

export default Select;
