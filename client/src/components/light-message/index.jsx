import React, { useState } from 'react';
import './index.pcss';

const LightMessage = ({ children, message, onClick }) => {
  const [ active, setActive ] = useState(false);

  const clickHandler = () => {
    onClick && onClick();
    setActive(true);
    
    setTimeout(() => {
      setActive(false);
    }, 1000);
  }

  return (
    <em className={`light-message ${active ? 'active' : ''}`} data-msg={message} onClick={clickHandler}>
      {children}
    </em>
  );
};

export default LightMessage;
