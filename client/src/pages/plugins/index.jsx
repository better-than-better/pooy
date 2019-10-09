import React, { useState } from 'react';
import I18N from '@i18n';
import { getLan } from '@helper/utils';
import HelpTips from '@components/help-tips';
import SubTitle from '@components/sub-title';
import Icon from '@components/icon';
import './index.pcss';

const Plugins = () => {
  const Language = I18N[getLan()].plugin;
  const [ listData, setListData ] = useState([
    {
      name: 'Mock',
      type: 'system',
      desc: '提供一种接口数据模拟的方式',
      status: 1,
      icon: '//note-cdn.hxtao.xyz/images/8cd18c4636c7eb20dc3f05b3.webp'
    },
    {
      name: 'JSONP Preview',
      type: 'system',
      desc: 'jsonp 格式化插件，优化数据查 看体验',
      status: 0,
      icon: '//note-cdn.hxtao.xyz/images/bb8be2047db1f300ca18d258.webp'
    }
  ]);

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
                  <div className="status">
                    <Icon type="add1" /> {Language['install']}
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
