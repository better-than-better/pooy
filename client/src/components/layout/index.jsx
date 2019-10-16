import React from 'react';
import { NavLink } from 'react-router-dom';
import I18N from '@i18n';
import { getLan, getPageEnv } from '@helper/utils';
import Logo from '@components/logo';
import Icon from '@components/icon';
import ToggleMenu from '@components/toggle-menu';
import './index.pcss';

class Layout extends React.PureComponent{
  state = {
    slimming: localStorage.getItem('pooy:slimming') === 'true'  // 侧栏瘦身
  }

  componentDidMount() {
    window.updateLayout = this.forceUpdate.bind(this);
  }

  /**
   * 控制侧栏
   */
  handleToggle = (slimming) => {
    this.setState({ slimming });
    localStorage.setItem('pooy:slimming', slimming);
  }

  render() {
    const Language = I18N[getLan()].global;
    const { slimming } = this.state;
    const inBrowser = getPageEnv() === 'web';
    const style = (inBrowser || !slimming) ? null : { margin: '40px 10px' };

    return (
      <div className={`layout ${slimming ? 'slimming' : ''}`}>
        {/* 侧边栏 */}
        <aside style={style}>
          <div className="brand">
            <Logo />
            POOY
          </div>
          <nav>
            <NavLink exact to="/" title={Language['nav-network']}><Icon type="network" />{Language['nav-network']}</NavLink>
            <NavLink to="/rules" title={Language['nav-rule']}><Icon type="rules" />{Language['nav-rule']}</NavLink>
            <NavLink to="/plugins" title={Language['nav-plugin']}><Icon type="plugins" />{Language['nav-plugin']}</NavLink>
            <NavLink to="/ca" title={Language['nav-ca']}><Icon type="ca" />{Language['nav-ca']}</NavLink>
            <NavLink to="/setting" title={Language['nav-setting']}><Icon type="setting" />{Language['nav-setting']}</NavLink>
            <NavLink to="/about" title={Language['nav-about']}><Icon type="about" />{Language['nav-about']}</NavLink>
          </nav>
          <ToggleMenu onToggle={this.handleToggle} open={!slimming} />
        </aside>
        <main>
          {this.props.children}
        </main>
        {!inBrowser && <div className="drag-bar"/>}
      </div>
    );
  }
}

export default Layout;
