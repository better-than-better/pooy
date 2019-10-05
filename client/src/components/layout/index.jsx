import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '@components/logo';
import Icon from '@components/icon';
import ToggleMenu from '@components/toggle-menu';
import './index.pcss';

class Layout extends React.PureComponent{
  state = {
    slimming: true  // 侧栏瘦身
  }

  /**
   * 控制侧栏
   */
  handleToggle = (slimming) => {
    this.setState({ slimming });
  }

  render() {
    const { slimming } = this.state;

    return (
      <div className={`layout ${slimming ? 'slimming' : ''}`}>
        {/* 侧边栏 */}
        <aside>
          <div className="brand">
            <Logo />
            POOY
          </div>
          <nav>
            <NavLink exact to="/"><Icon type="network" />网络</NavLink>
            <NavLink to="/rules"><Icon type="rules" />规则</NavLink>
            <NavLink to="/plugins"><Icon type="plugins" />插件</NavLink>
            <NavLink to="/ca"><Icon type="ca" />证书</NavLink>
            <NavLink to="/setting"><Icon type="setting" />设置</NavLink>
            <NavLink to="/about"><Icon type="about" />关于</NavLink>
          </nav>
          <ToggleMenu onToggle={this.handleToggle} open={!slimming} />
        </aside>
        <main>
          {this.props.children}
        </main>
      </div>
    );
  }
}

export default Layout;
