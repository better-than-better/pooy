import React, { useState, useEffect } from 'react';
import I18N from '@i18n';
import { getLan, setLan } from '@helper/utils';
import SubTitle from '@components/sub-title';
import Select from '@components/select';
import message from '@components/message';
import './index.pcss';

const Option = Select.Option;

const Setting = () => {
  const Language = I18N[getLan()].setting;
  const [ lan, setLang ] = useState(getLan());

  const handleLan = (value) => {
    setLang(value);
    setLan(value);
    message.success(I18N[value].setting['ok-message']);
  };

  return (
    <div className="setting-page">
      <SubTitle name={Language['sub-title']} />
      <div className="content">
        <div className="row">
          <span>{Language['lan']}:</span>
          <Select value={lan} onChange={handleLan}>
            <Option value="zh">中文</Option>
            <Option value="en">English</Option>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default Setting;
