import React from 'react';
import ReactDOM from 'react-dom';
import API from '@api';
import Icon from '@components/icon';
import Spin from '@components/spin';
import Tabs from '@components/tabs';
import InfoBlock from '@components/info-block';
import ResponsePreview from '@components/response-preview';
import CookiePreivew from '@components/cookie-preview';
import FormData from '@components/form-data';
import JSONPreview from '@components/json-preview';
import RuleInfo from '../../components/rule-info';
import { getField, throttle } from '@helper/utils';
import qs from 'querystring';
import './index.pcss';

const { TabPane } = Tabs;

const filterWidth = (width) => {
  const minWidth = 200;
  const maxWidth = document.body.offsetWidth - 120;

  return width = width < minWidth ? minWidth : width > maxWidth ? maxWidth : width;
}

const getUserWidth = () => {
  const containerWidth = +localStorage.getItem('containerWidth');

  return isNaN(containerWidth) ? null : filterWidth(containerWidth);
};

class NetworkDetail extends React.PureComponent{
  state = {
    loading: false,
    activeKey: 'header',
    visible: this.props.visible,
    responseBody: null
  }

  div = document.createElement('div')

  static getDerivedStateFromProps({ visible }, state) {
    const newState = {};

    if (state.visible !== visible) {
      newState.visible = visible;
    }

    return newState;
  }

  componentDidMount() {
    document.body.appendChild(this.div);
    document.body.addEventListener('mousemove', this.handleMouseMove);
    document.body.addEventListener('mouseup', this.handleMouseUp);
  }

  componentDidUpdate(prevProps) {
    const { id } = this.props;
    const { activeKey } = this.state;

    if (prevProps.id !== id && ['response', 'preview'].includes(activeKey)) {
      this.fetchResponse(id, activeKey);
    }
  }

  componentWillUnmount() {
    document.body.removeChild(this.div);
    document.body.removeEventListener('mousemove', this.handleMouseMove);
    document.body.removeEventListener('mouseup', this.handleMouseUp);
  }

  /**
   * 显示详情
   */
  showModal = () => {
    document.body.appendChild(this.div);
    this.setState({ visible: true, activeKey: 'header' });
  }

  /**
   * 关闭详情
   */
  closeModal = () => {
    const { onClose } = this.props;

    if (onClose) {
      onClose();
    } else {
      this.setState({ visible: false });
    }

    this.setState({ activeKey: 'header' });
  }

  /**
   * tab 切换
   * @param {String} activeKey
   */
  handleTabChange = (activeKey) => {
    this.setState({ activeKey });
    this.fetchResponse(this.props.id, activeKey);
  }

  /**
   * 获取响应体
   * @param {String} requestId
   * @param {String} activeKey
   */
  fetchResponse = async (requestId, activeKey) => {
    const { resData } = this.props.data;
    const hasResponsed = !!resData.statusCode;
    const contentType = getField(resData.headers, 'content-type');

    if (!hasResponsed) return;

    this.setState({ loading: true, responseBody: null });

    if (activeKey === 'preview' && /(image|video|audio)/.test(contentType)) {
      this.setState({
        responseBody: `//127.0.0.1:9000/response.pooy?id=${requestId}`
      });
    } else {
      if (!/(text|application)/.test(contentType)) {
        this.setState({ responseBody: `⚠️⚠️不支持查看的请求体 ➜➜➜ content-type: ${contentType}` });
      } else {
        const res = await API.fetchResponse(requestId);

        this.setState({ responseBody: res });
      }
    }

    this.setState({ loading: false });
  }

  /**
   * 开始拖拽
   */
  handleMouseDown = (e) => {
    console.log('开始拖拽');
    this.startX = e.clientX;
    this.isResizing = true;
    document.body.style.userSelect = 'none';
  }

  /**
   * 松开停止拖拽
   */
  handleMouseUp = () => {
    this.isResizing = false;
    document.body.style.userSelect = '';
    this.ref && localStorage.setItem('containerWidth', this.ref.offsetWidth);
  }

  /**
   * 移动
   */
  handleMouseMove = throttle((e) => {
    if (!this.isResizing) return;

    const currentWidth = this.ref.offsetWidth;
    const movedX = e.clientX - this.startX;
    const width = currentWidth - movedX;

    this.ref.style.width = filterWidth(width) + 'px';
    this.startX = e.clientX;
  }, 10)

  render() {
    const { visible, responseBody, activeKey, loading } = this.state; 
    const { reqData, resData } = this.props.data;
    const generalData = {
      'Request URL': `${reqData.protocol}//${reqData.host}${reqData.path}`,
      'Request Method': reqData.method,
      'Status Code': resData.statusCode === 200 ? <><Icon type="ok" />200 ok</> : resData.statusCode,
      'Remote Address': resData.remote,
      'Version': `HTTP/${reqData.httpVersion}`,
      'Referrer Policy': getField(reqData.headers, 'referer')
    };
    const isNotFromCache = resData.statusCode !== 304;
    const hasError = resData.error;
    const queryString = generalData['Request URL'].split('?')[1];
    const contentType = getField(reqData.headers, 'content-type');

    console.log(reqData.headers)

    return  visible ? ReactDOM.createPortal((
      <div className="network-detail" ref={ref => this.ref = ref } style={{ width: getUserWidth() }}>
        <div className="drag" onMouseDown={this.handleMouseDown} />
        <Icon type="close close-icon" onClick={this.closeModal} />
        <Tabs activeKey={activeKey} onChange={this.handleTabChange}>
          <TabPane tab="Header" key="header">
            <InfoBlock title="General" data={generalData} noSort noSource />
            <InfoBlock title="Response Headers" data={resData.headers} />
            <InfoBlock title="Request Headers" data={reqData.headers} />
            {queryString && <InfoBlock
              title="Query String Parameters"
              data={qs.parse(queryString)}
              source={queryString}
            />}

            {
              /application\/json/.test(contentType) && <InfoBlock title="Request Payload" render={() => <JSONPreview data={JSON.parse(reqData.body || null)} />} />
            }

            {
              /x-www-form-urlencoded/.test(contentType) && <InfoBlock title="Form Data" data={qs.parse(reqData.body)} source={reqData.body} />
            }

            {
              /multipart\/form-data/.test(contentType) && <FormData data={reqData.body} boundary={getField(reqData.headers, 'content-type').split('boundary=')[1]}  />
            }
          </TabPane>
          {isNotFromCache && <TabPane tab="Preview" key="preview">
            <Spin spinning={loading} text="加载中...">
              <ResponsePreview
                resData={resData}
                data={responseBody}
                originalSrc={generalData['Request URL']}
              />
            </Spin>
          </TabPane>}
          {isNotFromCache && <TabPane tab="Response" key="response">
            <Spin spinning={loading} text="加载中...">
              {resData.statusCode
                ? responseBody
                  ? <textarea className="response-body" value={responseBody} readOnly />
                  : <div className="empty-body">没有响应体</div>
                : <div className="empty-body">{hasError ? `请求失败: ${resData.error.message}` : '等待响应'}</div>
              }
            </Spin>
          </TabPane>}
          <TabPane tab="Cookies" key="cookies">
            <CookiePreivew
              resCookie={getField(resData.headers, 'set-cookie')}
              reqCookie={getField(reqData.headers, 'cookie')}
            />
          </TabPane>
          <TabPane tab="Rule" key="rule">
            <RuleInfo />
          </TabPane>
        </Tabs>
      </div>
    ), this.div) : null;
  }
}

export default NetworkDetail;
