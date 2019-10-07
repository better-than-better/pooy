import React from 'react';
import Switch from '@components/switch';
import Button from '@components/button';
import Icon from '@components/icon';
import './index.pcss';

const Rules = (props) => {
  return (
    <div className="rules-page">
      <div className="header">
        <Switch>启用</Switch>
        <Button><Icon type="add" /> 创建</Button>
      </div>
      <div className="rule-list">

      </div>
    </div>
  );
}

export default Rules;
