import React from 'react';
import LightMessage from '@components/light-message';
import PropTypes from 'prop-types';
import './index.pcss';

const filterValue = (data) => {
  if (typeof data === 'string') return data;

  const arr = data.props && data.props.children.filter(v => typeof v === 'string');

  return arr && arr.join('');
};

const LabelItem = ({ name, value }) => {
  let input = null;

  const handleClick = () => {
    input && input.select();
    document.execCommand('copy');
  };

  return value ? (
    <div className="label-item">
      <label>{name}:</label>
      <span>{value}</span>
      <LightMessage onClick={handleClick} message="复制成功" >Copy</LightMessage>
      <input type="text" value={filterValue(value)} ref={ref => input = ref} readOnly />
    </div>
  ) : null;
}

LabelItem.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any
};

export default LabelItem;
