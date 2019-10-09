import React, { useEffect, useState } from 'react';
import I18N from '@i18n';
import { getLan } from '@helper/utils';
import Switch from '@components/switch';
import Button from '@components/button';
import Icon from '@components/icon';
import './index.pcss';

const Rules = (props) => {
  const Language = I18N[getLan()].rule;
  const columns = [{
    title: 'id',
    key: 'id',
    width: '10%'
  }, {
    title: Language['type'],
    key: 'type',
    width: '20%',
    render: (val) => typeEnum[val]
  }, {
    title: Language['desc'],
    key: 'desc',
    width: '50%'
  }, {
    title: Language['operate'],
    key: 'operate',
    width: '20%',
    render: (val, v) => (
      <div className="menus">
       {v.enabled ? <a className="disabled-menu" href="javasscript:">{Language['disable']}</a> :  <a className="enabled-menu" href="javasscript:">{Language['enable']}</a>}
        <a className="del-menu" href="javasscript:">{Language['del']}</a>
      </div>
    )
  }];
  const typeEnum = {
    0: Language['dns-analysis'],
    1: Language['request-forward'],
    2: Language['custom-response-header'],
    3: Language['custom-script']
  };
  const [ checked, setChecked ] = useState(true);
  const [ listData, setListData ] = useState([
    {
      id: 0,
      type: 0,
      desc: '这是一条 DNS 解析规则'
    },
    {
      id: 1,
      type: 1,
      enabled: true,
      desc: '这是一条 DNS 解析规则'
    },
    {
      id: 2,
      type: 2,
      desc: '这是一条 DNS 解析规则'
    }
  ]);
  const toggleChecked = (checked) => {
    setChecked(checked);
  };

  return (
    <div className="rules-page">
      <div className="header">
        <Switch checked={checked} onChange={toggleChecked}>
          {checked ? Language['disable'] : Language['enable']}
          {
            checked ?  <span className="help-tips enabled">{Language['enabled-desc']}</span> : <span className="help-tips disabled">{Language['disabled-desc']}</span>
          }
        </Switch>
        <Button><Icon type="add" />{Language['create']}</Button>
      </div>
      <div className={`rule-list ${checked ? '' : 'disabled'}`}>
        <div className="list-header list-tr">
          {columns.map(v => (<div key={v.key} className="th" style={{ width: v.width }}>{v.title}</div>))}
        </div>
        <div className="list-body">
          {listData.length ? listData.map((v, i) => (
            <div className="list-tr" key={i}>
              {
                columns.map(({ render, width, key }) => (
                  <div
                    className="td"
                    key={key}
                    style={{ width }}
                  >
                    {render ? render(v[key], v) : v[key]}
                  </div>
                ))
              }
            </div>
          )) : <div className="empty">{Language['empty']}</div>}
        </div>
      </div>
    </div>
  );
}

export default Rules;
