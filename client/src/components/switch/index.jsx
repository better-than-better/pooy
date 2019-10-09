import React, { useEffect, useState } from 'react';
import './index.pcss';

const Switch = ({ children, checked, onChange }) => {
  const [ active, setActive ] = useState(checked);
  const handleClick = () => {
    if (onChange) {
      onChange(!active);
    } else {
      setActive(!active);
    }
  };

  useEffect(() => {
    setActive(checked);
  }, [checked]);

  return (
    <div className={`pooy-switch ${active ? 'active' : ''}`}>
      <div className="box" onClick={handleClick} />
      {children}
    </div>
  );
};

Switch.defaultProps = {
  checked: false
};

export default Switch;
