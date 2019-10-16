import React from 'react';
import './index.pcss';

const w = val => val ? +val : null;

const Textarea = (props) => (
  <textarea {...props} className={`pooy-textarea ${props.className}`} style={{...props.style, width: w(props.width)}} />
);

Textarea.defaultProps = {
  className: ''
};

export default Textarea;
