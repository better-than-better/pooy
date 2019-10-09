import React from 'react';
import PropTypes from 'prop-types';
import './index.pcss';

const HelpTips = ({ text }) => (
  <div className="pooy-help-tips">
    {text}
  </div>
);

HelpTips.defaultProps = {
  text: 'text text text'
};

HelpTips.propTypes = {
  text: PropTypes.string
};

export default HelpTips;
