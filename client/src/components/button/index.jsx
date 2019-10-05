import React from 'react';
import PropTypes from 'prop-types';
import './index.pcss';

const Button = ({ children, className, htmlType, onClick, disabled }) => (
  <div className={`pooy-button ${className} ${disabled ? 'disabled' : ''}`}>
    <div className="btn-shadow"></div>
    <button type={htmlType} onClick={onClick} disabled={disabled}>{children}</button>
  </div>
);

Button.defaultProps = {
  htmlType: 'text',
  className: '',
  disabled: false
};

Button.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  htmlType: PropTypes.oneOf(['text', 'submit', 'reset'])
}

export default Button;
