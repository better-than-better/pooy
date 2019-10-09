import React, { useState, useEffect } from 'react';
import './index.pcss';

import I18N from '@i18n';
import { getLan } from '@helper/utils';

const Language = I18N[getLan()].network;

const MimeTypePicker = (props) => {
  const types = [{
    name: Language['mime-all'],
    key: 'all'
  }, {
    name: Language['mime-html'],
    key: 'html'
  }, {
    name: Language['mime-js'],
    key: 'js'
  }, {
    name: Language['mime-css'],
    key: 'css'
  }, {
    name: Language['mime-img'],
    key: 'image'
  }, {
    name: Language['mime-audio'],
    key: 'audio'
  }, {
    name: Language['mime-video'],
    key: 'video'
  }, {
    name: Language['mime-font'],
    key: 'font'
  }, {
    name: Language['mime-other'],
    key: 'others'
  }];

  const [ value, setValue ] = useState(props.value);

  const handleClick = (val) => {
    if (val == value) return;

    if (props.onChange) return props.onChange(val);

    setValue(val);
  };

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return (
    <div className="type-picker">
      {types.map(v => (<div className={`type-item ${value === v.key ? 'actived' : ''}`} key={v.key} onClick={handleClick.bind(null, v.key)}>{v.name}</div>))}
    </div>
  );
};

export default MimeTypePicker;
