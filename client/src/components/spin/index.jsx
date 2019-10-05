import React from 'react';
import './index.pcss';

const Spin = ({ spinning, children, text }) => {
  return spinning ? (
    <>
      <div className="spin-wrapper">
        <div className="inner">
          <span></span>
          <span></span>
          <span></span>
          {text && <p>{text}</p>}
        </div>
      </div>
      {children}
    </>
  ) : children;
};

export default Spin;
