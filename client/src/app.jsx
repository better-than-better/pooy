import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Layout from '@components/layout';

import NetworkPage from '@pages/network';
import RulesPage from '@pages/rules';
import PluginsPage from '@pages/plugins';
import CAPage from '@pages/ca';
import SettingPage from '@pages/setting';
import AboutPage from '@pages/about';

import io from 'socket.io-client';

import './app.pcss';

window.socket = io('http://127.0.0.1:9000');

class App extends React.PureComponent{
  state = {
    requestData: {},
    responseData: {}
  }

  componentDidMount() {
    Notification.requestPermission();
  }

  DATA_POOL = {
    requestData: {},
    responseData: {}
  }

  clearDataPool = () => {
    this.DATA_POOL = {
      requestData: {},
      responseData: {}
    }
  }

  updateDataPool = (type, data) => {
    this.DATA_POOL[type][data.id] = data;
  }

  render() {
    return (
      <Router>
        <Layout>
          <Switch>
            <Route path="/" exact component={(props) => <NetworkPage {...props} dataPool={this.DATA_POOL} onData={this.updateDataPool} clearDataPool={this.clearDataPool} />} />
            <Route path="/rules" component={RulesPage} />
            <Route path="/plugins" component={PluginsPage} />
            <Route path="/ca" component={CAPage} />
            <Route path="/setting" component={SettingPage} />
            <Route path="/about" component={AboutPage} />
          </Switch>
        </Layout>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

if (module.hot) {
  module.hot.accept();
}
