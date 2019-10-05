import React from 'react';
import './index.pcss';

const Input = (props) => (
  <input {...props} className={`pooy-input ${props.className}`} />
);

Input.defaultProps = {
  className: ''
};

export default Input;
