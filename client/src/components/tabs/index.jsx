import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './index.pcss';

const TabPane = ({ children, actived }) => <div className={`tabpane ${actived ? 'actived' : ''}`}>{children}</div>;

const TabMenu = ({ children, actived, onClick }) => <div className={`tab-menu ${actived ? 'actived' : ''}`} onClick={onClick}>{children}</div>;

const Tabs = (props) => {
  const { onChange, children, className, tabMenusCls, tabPanesCls, mode, extra } = props;
  const [ activeKey, setActiveKey ] = useState(props.activeKey || props.defaultActiveKey);

  if (!Array.isArray(children)) {
    children = [children];
  }

  const handleTabChange = (key) => {
    if (key === activeKey) return;

    if (onChange) return onChange(key);

    setActiveKey(key);
  };

  useEffect(() => {
    setActiveKey(props.activeKey || props.defaultActiveKey);
  }, [props.activeKey]);

  const c = children.filter(v => v);

  return (
    <div className={`tabs-wrapper ${className}`}>
      <div className={`tab-menus ${tabMenusCls}`}>
        {extra}
        {c.map(v => (<TabMenu onClick={handleTabChange.bind(null, v.key)} actived={activeKey === v.key} key={v.key}>{v.props.tab}</TabMenu>))}
      </div>
      <div className={`tabpanes ${tabPanesCls}`}>
        {
          mode === 'all'
            ? c.map(v => (<TabPane actived={activeKey === v.key} key={v.key}>{v.props.children}</TabPane>))
            : c.filter(v => activeKey === v.key).map(v => <TabPane actived key={v.key}>{v.props.children}</TabPane>)
        }
      </div>
    </div>
  );
};

Tabs.TabPane = TabPane;

Tabs.defaultProps = {
  className: '',
  tabMenusCls: '',
  tabPanesCls: '',
  mode: 'part' // all or part
};

Tabs.propTypes = {
  className: PropTypes.string,
  tabMenusCls: PropTypes.string,
  tabPaneCls: PropTypes.string,
  mode: PropTypes.oneOf(['all', 'part'])
};

export default Tabs;
