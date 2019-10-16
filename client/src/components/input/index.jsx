import React from 'react';
import PropTypes from 'prop-types';
import './index.pcss';

const w = val => val ? +val : null;

const Input = (props) => (
  <input {...props} className={`pooy-input ${props.className}`} style={{...props.style, width: w(props.width)}} />
);

Input.defaultProps = {
  className: ''
};

Input.propTypes = {
  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
};

export default Input;
