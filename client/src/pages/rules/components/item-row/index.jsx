import React from 'react';
import './index.pcss';

const ItemRow = ({ name, children, className }) => (
  <div className={`row-item ${className}`}>
    <div className="row-name">{name}:</div>
    <div className="row-content">
      {children}
    </div>
  </div>
);

ItemRow.defaultProps = {
  name: 'unnamed',
  className: ''
};

export default ItemRow;
