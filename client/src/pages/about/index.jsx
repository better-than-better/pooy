import React from 'react';
import I18N from '@i18n';
import { getLan } from '@helper/utils';
import SubTitle from '@components/sub-title';
import message from '@components/message';
import './index.pcss';


const About = (props) => {
  const Language = I18N[getLan()].about;
  const checkUpdate = () => {
    message.info(Language['updated']);
  };

  return (
    <div className="about-page">
      <SubTitle name={Language['sub-title']} />
      <div className="content">
        <p>{Language['current-v']} 0.0.1-beta <button onClick={checkUpdate}>{Language['current-v']}</button></p>
      </div>
    </div>
  );
}

export default About;
