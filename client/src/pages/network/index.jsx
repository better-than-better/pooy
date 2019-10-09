import React from 'react';
import I18N from '@i18n';
import { getLan } from '@helper/utils';

import Button from '@components/button';
import Input from '@components/input';
import Icon from '@components/icon';
import Radio from '@components/radio';
import Modal from '@components/modal';
import MimeTypePicker from '@components/mime-type-picker';
import NetworkDetail from './modules/network-detail';
import API from '@api';
import { getField } from '@helper/utils';
import './index.pcss';

const filterIcons = (contentType) => {
  if (/html/.test(contentType)) return 'html';

  if (/javascript/.test(contentType)) return 'js';

  if (/json/.test(contentType)) return 'json';

  if (/(css|stylesheet)/.test(contentType)) return 'css';

  if (/font/.test(contentType)) return 'font';

  if (/image/.test(contentType)) return 'image';

  if (/audio/.test(contentType)) return 'audio';

  if (/video/.test(contentType)) return 'video';

  return 'file';
};

const filterSize = (contentLength) => {
  const compressSize = contentLength / 1024;

    if (isNaN(compressSize)) return '-';

    if (contentLength < 1024) return contentLength + 'b';

    if (compressSize > 512) return (compressSize / 1024).toFixed(1) + 'M';

    return compressSize.toFixed(1) + 'kb';
};

const filterTime = (time = '') => {
  if (!time) return '-';

  if (time < 1000) return `${time}ms`;

  if (time < 1000 * 60) return `${time / 1000}s`;

  return `${time / (1000 * 60)}m`;
};

const filterHttps = (protocol) => {
  return protocol === 'https:' ? <Icon type="https" /> : null;
}

class Network extends React.PureComponent {
  state = {
    activeId: null,
    enabled: true,
    mimieType: 'all',
    visible: false, // 网络环境的弹窗显示或隐藏
    keywords: '',
    requestData: this.props.dataPool.requestData,
    responseData: this.props.dataPool.responseData,
    currentNetwork: {
      reqData: {},
      resData: {}
    },
    throttlingType: 'online'
  }

  /**
   * 更新消息池
   * @param {String} type
   * @param {Object} data
   */
  updateDataPool = (type, data) => {
    const obj = this.state[type];

    obj[data.id] = {...obj[data.id], ...data};
    this.setState({ [type]: {...obj} });
    this.props.onData && this.props.onData(type, data);
  }

  componentDidMount() {
    window.socket.on('request', (data) => {
      this.updateDataPool('requestData', data);
    });

    window.socket.on('requestEnd', (data) => {
      console.log('requestEnd', data);
      this.updateDataPool('requestData', data);
    });

    window.socket.on('responseEnd', (data) => {
      this.updateDataPool('responseData', data);
    });

    this.fetchProxyStatus();
  }

  /**
   * 代理转态
   */
  fetchProxyStatus = async () => {
    const { enabled } = await API.fetchProxyStatus();

    this.setState({ enabled });
  }

  /**
   * 切换代理状态
   */
  toggleStatus = () => {
    const enabled = !this.state.enabled;
    socket.emit('enabled', enabled);
    this.setState({ enabled });
  }

  handleThrottlingType = (e) => {
    const val = e.target.value;
    const newState = {
      throttlingType: val,
      upload: '',
      download: ''
    };

    if (val === '4g') {
      newState.upload = 1024*1024;
      newState.download = 1024*1024;
    }

    if (val === '3g') {
      newState.upload = 1024;
      newState.download = 1024;
    }

    this.setState(newState);
  }

  /**
   * 类型筛选
   */
  handleMimeChange = (mimieType) => {
    this.setState({ mimieType, activeId: null });
  }

  filterShows(mimieType, keywords, requestData, responseData) {
    const regEnum = {
      html: (str) => /html/ig.test(str),
      js: (str) => /(js|json|javascript)/ig.test(str),
      css: (str) => /css/ig.test(str),
      image: (str) => /image/ig.test(str),
      audio: (str) => /audio/ig.test(str),
      video: (str) => /video/ig.test(str),
      font: (str) => /font/ig.test(str),
      others: (str) => !/(html|javascript|json|css|image|audio|video|font)/ig.test(str)
    };

    if (mimieType === 'all') {
      const ids = [];

      Object.keys(requestData).forEach(key => {
        const reqData = requestData[key] || {};
        const url = `${reqData.protocol}//${reqData.host}${reqData.path}`;
        const hitUrl = keywords ? (new RegExp(keywords, 'g')).test(url) : true;

        if(hitUrl) {
          ids.push(key);
        }
      });

      return ids;
    };

    const ids = [];

    Object.keys(responseData).forEach(key => {
      const reqData = requestData[key] || {};
      const resData = responseData[key] || {};
      const contentType = getField(resData.headers, 'content-type');
      const url = `${reqData.protocol}//${reqData.host}${reqData.path}`;
      const hitUrl = keywords ? (new RegExp(keywords, 'g')).test(url) : true;

      if (regEnum[mimieType](contentType) && hitUrl) {
        ids.push(key);
      }
    });

    return ids;
  }

  handleKewords = (e) => {
    const value = e.target.value;

    this.setState({ keywords: value && value.trim() });
  }


  /**
   * 展示网络详情
   * @param {String} activeId 
   */
  showDetail = (activeId) => {
    const currentNetwork = {
      reqData: this.state.requestData[activeId] || {},
      resData: this.state.responseData[activeId] || {}
    };

    this.setState({
      activeId,
      currentNetwork
    });
  }

  /**
   * 关闭网络详情
   */
  closeDetail = () => {
    this.setState({ activeId: null });
  }

  /**
   * 清除当前数据
   */
  clearData = () => {
    this.props.clearDataPool();
    this.setState({
      activeId: null,
      requestData: {},
      responseData: {}
    });
  }

  showModal = () => {
    this.setState({ visible: true });
  }

  closeModal = () => {
    this.setState({
      visible: false
    });
  }

  handleOk = () => {
    this.closeModal();
  }

  handleCancel = () => {
    this.closeModal();
  }

  handleThrottlingValue = (type, e) => {
    this.setState({ [type]: e.target.value });
  }

  renderThrottlingOptions = () => {
    const Language = I18N[getLan()].network;
    const { upload, download, throttlingType } = this.state;
    const disabled = ['4g', '3g'].includes(throttlingType);

    if (throttlingType === 'offline') {
      return <div className="throttling-desc offline">⚠️ {Language['offline-tips']} ⚠️</div>;
    }

    if (throttlingType === 'online') {
      return <div className="throttling-desc online">✅ {Language['online-tips']} ✅</div>;
    }

    return (
      <div className="throttling-options">
        <div className="item">
          <label>{Language['upload']}:</label>
          <Input placeholder={Language['throttling-custom-placeholder']} value={upload} disabled={disabled} onChange={this.handleThrottlingValue.bind(null, 'upload')} />
          kb/s
        </div>
        <div className="item">
          <label>{Language['download']}:</label>
          <Input placeholder={Language['throttling-custom-placeholder']} value={download} disabled={disabled} onChange={this.handleThrottlingValue.bind(null, 'download')} />
          kb/s
        </div>
      </div>
    );
  }
  

  render() {
    const Language = I18N[getLan()].network;
    const {
      activeId, enabled, requestData = {},
      responseData = {}, currentNetwork, mimieType,
      keywords, visible, throttlingType
    } = this.state;

    const requestIds = this.filterShows(mimieType, keywords, requestData, responseData);

    const columns = [{
      title: Language['list-type'],
      key: 'type',
      width: '10%',
      render: (req = {}, res = { headers: {} }) => <Icon type={filterIcons(res.headers['content-type'])} />
    }, {
      title: Language['list-status'],
      key: 'statusCode',
      width: '11%',
      render: (req = {}, res = {}) => res.error ? '💣 fail' : (res.statusCode || '-')
    }, {
      title: Language['list-method'],
      key: 'method',
      width: '11%',
      render: (req = {}) => req.method || '-'
    }, {
      title: Language['list-domain'],
      key: 'host',
      width: '21%',
      render: (req = {}) => (<>{filterHttps(req.protocol)}{req.host || '-'}</>)
    }, {
      title: Language['list-path'],
      key: 'path',
      width: '25%',
      render: (req = {}) => req.path || '-'
    }, {
      title: Language['list-size'],
      key: 'size',
      width: '11%',
      render: (req = {}, res = { headers: {} }) => filterSize(res.headers['content-length'])
    }, {
      title: Language['list-time'],
      key: 'time',
      width: '11%',
      render: (req = {}, res = {}) => filterTime(res.time - req.time)
    }];

    return (
      <div className="network-wrapper">
        {/* 工具栏 */}
        <div className="action-bar">
          <div className="btns">
            <Button onClick={this.toggleStatus}>
              {enabled ? <><Icon type="start" />{Language['action-start']}</> : <><Icon type="stop" />{Language['action-stop']}</>}
            </Button>
            <Button onClick={this.clearData}><Icon type="clear" />{Language['action-clear']}</Button>
            <Button onClick={this.showModal}><Icon type="throttling" />{Language['action-throttling']}（{Language['action-throttling-unset']}）</Button>
            <Button disabled><Icon type="repeat" />{Language['action-repeat']}</Button>
          </div>
          <div className="filter-wrapper">
            <input
              type="text"
              placeholder={Language['action-filter']}
              value={keywords}
              onChange={this.handleKewords}
            />
            <Icon type="filter" />
          </div>
        </div>
        <MimeTypePicker onChange={this.handleMimeChange} value={mimieType} />
        <div className="request-list">
          <div className="list-header list-tr">
            {columns.map(v => (<div key={v.key} className="th" style={{ width: v.width }}>{v.title}</div>))}
          </div>
          <div className="list-body">
            {
              requestIds.length ? requestIds.map(id => (
                <div className={`list-tr ${activeId === id ? 'actived' : ''} ${responseData[id] ? '' : 'pending'}`} key={id} onClick={this.showDetail.bind(null, id)}>
                  {
                    columns.map(({ render, key, width }) => (
                      <div
                        className={`td ${(responseData[id] && responseData[id].error) ? 'error' : ''}`}
                        key={key}
                        style={{ width: width }}
                      >
                        {render ? render(requestData[id], responseData[id]) : requestData[id][key]}
                      </div>
                    ))
                  }
                </div>
              )) : <div className="empty">{Language['list-empty']}</div>
            }
          </div>
        </div>
        <NetworkDetail
          id={activeId}
          data={currentNetwork}
          visible={!!activeId}
          onClose={this.closeDetail}
        />
        <Modal
          title={Language['action-throttling-modal-title']}
          visible={visible}
          onClose={this.closeModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Radio.Group value={throttlingType} onChange={this.handleThrottlingType}>
            <Radio value="online">Online</Radio>
            <Radio value="offline">Offline</Radio>
            <Radio value="4g">4G</Radio>
            <Radio value="3g">3G</Radio>
            <Radio value="custom">Custom</Radio>
          </Radio.Group>
          {this.renderThrottlingOptions()}
        </Modal>
      </div>
    );
  }
}

export default Network;
