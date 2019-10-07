import React from 'react';
import SubTitle from '@components/sub-title';
import './index.pcss';

const About = (props) => {
  return (
    <div className="about-page">
      <SubTitle name="关于 pooy" />
      <div className="content">
        <p>当前版本 0.0.1-beta <button>检测更新</button></p>
      </div>
    </div>
  );
}

export default About;
