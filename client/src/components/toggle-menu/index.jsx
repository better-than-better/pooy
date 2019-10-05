import React, { useState, useEffect } from 'react';
import Icon from '@components/icon';
import './index.pcss';

const ToggleMenu = (props) => {
  const [ open, setOpen] = useState(props.open);
  const handleClick = () => {
    if (props.onToggle) {
      props.onToggle(!open);
    } else {
      setOpen(!open);
    }
  };

  useEffect(() => {
    setOpen(!props.open);
  }, [props.open]);

  return (
    <div className="toggle-menu" style={{ flexDirection: open ? 'inherit' : 'row-reverse' }} onClick={handleClick}>
      <Icon type="jiantou" className="left" />
      <Icon type="jiantou" className="right" />
    </div>
  );
};

export default ToggleMenu;
