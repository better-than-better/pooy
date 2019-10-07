import React from 'react';
import './index.pcss';

const SubTitle = ({ name }) => (
  <div className="sub-title">
    <span>{name}</span>
  </div>
);

SubTitle.defaultProps = {
  name: 'untitle'
};


export default SubTitle;
