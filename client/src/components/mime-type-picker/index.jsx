import React, { useState, useEffect } from 'react';
import './index.pcss';

const types = [{
  name: '全部',
  key: 'all'
}, {
  name: 'HTML',
  key: 'html'
}, {
  name: 'JS',
  key: 'js'
}, {
  name: 'CSS',
  key: 'css'
}, {
  name: '图片',
  key: 'image'
}, {
  name: '音频',
  key: 'audio'
}, {
  name: '视频',
  key: 'video'
}, {
  name: '字体',
  key: 'font'
}, {
  name: '其它',
  key: 'others'
}];

const MimeTypePicker = (props) => {
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
