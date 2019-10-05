import React from 'react';
import PropTypes from 'prop-types';
import ThrottlingSVG from './throttling.svg';
import './index.pcss';

const Icon = ({ type, className, onClick }) => {
  if (type === 'throttling') {
    return (
      <i className={`pooy-icon ${className}`} onClick={onClick}><img src={ThrottlingSVG} alt="throttling-icon"/></i>
    );
  }

  return (
    <i className={`pooy-icon iconfont icon-${type} ${className}`} onClick={onClick} />
  );
};

Icon.defaultProps = {
  className: '',
  type: ''
};

Icon.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default Icon;
