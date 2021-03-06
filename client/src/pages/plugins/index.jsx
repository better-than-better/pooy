import React, { useState } from 'react';
import I18N from '@i18n';
import { getLan } from '@helper/utils';
import HelpTips from '@components/help-tips';
import SubTitle from '@components/sub-title';
import Icon from '@components/icon';

import icon1 from '@assets/p-mock.jpeg';
import icon2 from '@assets/p-jsonp.jpeg';

import './index.pcss';

const Plugins = () => {
  const Language = I18N[getLan()].plugin;
  const [ listData, setListData ] = useState([
    {
      name: 'Mock',
      type: 'system',
      desc: '提供一种接口数据模拟的方式',
      status: 1,
      icon: icon1
    },
    {
      name: 'JSONP Preview',
      type: 'system',
      desc: 'jsonp 格式化插件，优化数据查 看体验',
      status: 0,
      icon: icon2
    }
  ]);

  const [ installing, setInstalling ] = useState(false);

  const toInstall = () => {
    setInstalling(true);
  };

  return (
    <div className="plugins-page">
      <SubTitle name={Language['sub-title']} />
      <div className="plugins">
        {
          listData.map((v, i) => (
            <div className="plugin-item" key={i}>
              <h1>{v.name}</h1>
              <p>{v.desc}</p>
              {
                v.status === 1 ? (
                  <div className="status installed">
                    <Icon type="checked" /> {Language['installed']}
                  </div>
                ) : (
                  <div className="status" onClick={toInstall}>
                    <Icon type="add1" />
                    {installing ? Language['installing'] : Language['install']}
                  </div>
                )
              }
              <img src={v.icon} alt="icon"/>
              {v.status === 1 && <div className="uninstall">
                <Icon type="del" />
              </div>}
            </div>
          ))
        }
      </div>
      <HelpTips text={Language['help-tips']} />
    </div>
  );
}

export default Plugins;
