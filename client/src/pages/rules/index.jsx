import React, { useEffect, useState } from 'react';
import I18N from '@i18n';
import API from '@api';
import { getLan } from '@helper/utils';
import Switch from '@components/switch';
import Button from '@components/button';
import Icon from '@components/icon';
import Select from '@components/select';
import Modal from '@components/modal';
import message from '@components/message';
import ItemRow from './components/item-row';
import RulePicker from './module/rule-picker';
import './index.pcss';

const Option = Select.Option;

class Rules extends React.PureComponent {
  state = {
    visible: false,
    checked: window.rulesStatus,
    action: 'add',
    listData: []
  }

  componentDidMount() {
    this.fetchProxyRulesStatus();
    this.fetchRules();
  }

  fetchProxyRulesStatus = async () => {
    const data = await API.fetchProxyRulesStatus();

    window.rulesStatus = data.enabled;

    this.setState({ checked: data.enabled });
  }

  fetchRules = async () => {
    const data = await API.fetchProxyRules();

    if (data.error) {
      return message.fail(data.error.message);
    }

    this.setState({ listData: data });
  }

  delRule = async (id) => {
    const data = await API.delProxyRule(id);

    if (data.error) {
      return message.fail(data.error.message);
    }

    message.success('操作成功');
    this.fetchRules();
  }

  toggleRuleStatus = async (id, enabled) => {
    const ruleData = { id, enabled };
    const handler = ruleData.id ? API.updateProxyRule : API.saveProxyRule;
    const data = await handler(ruleData);

    if (data.error) {
      return message.fail(data.error.message);
    }

    message.success('操作成功');
    this.fetchRules();
  }

  toggleChecked = async (checked) => {
    const data = API.updateGlobalRuleStatus(checked);

    if (data.error) {
      return message.success(data.error.message);
    }

    this.setState({ checked });
  }

  showModal = (action, ruleId) => {
    const newState = {};

    if (action === 'add') {
      newState.ruleData = {};
      newState.ruleType = undefined;
    } else {
      const { listData } = this.state;
      const ruleData = {...listData.find(v => v.id === ruleId)} || {};

      newState.ruleData = ruleData;
      newState.ruleType = ruleData.type;
    }
    this.setState({ visible: true, action, ...newState });
  }

  closeModal = () => {
    this.setState({ visible: false });
  }

  handleRuleType = (ruleType) => {
    this.setState({ ruleType });
  }

  handleRuleData = (ruleData) => {
    this.setState({ ruleData });
  }

  handleOk = async () => {
    const { ruleData, ruleType } = this.state;

    if (!ruleType) {
      alert('请选择类型');
      return;
    };

    ruleData.type = {...ruleType};
    const handler = ruleData.id ? API.updateProxyRule : API.saveProxyRule;
    const data = await handler(ruleData);

    if (data.error) {
      message.fail(data.error.message);
    }

    message.success('操作成功');
    this.fetchRules();
    this.closeModal();
  }

  handleCancel = () => {
    this.closeModal();
  }

  render() {
    const Language = I18N[getLan()].rule;
    const columns = [{
      title: '#',
      key: 'index',
      width: '10%',
      render: (val, v, i) => i
    }, {
      title: Language['type'],
      key: 'type',
      width: '20%',
      render: (val) => typeEnum[val]
    }, {
      title: Language['desc'],
      key: 'desc',
      width: '50%'
    }, {
      title: Language['operate'],
      key: 'operate',
      width: '20%',
      render: (val, v) => (
        <div className="menus">
          <a className="edit-menu" href="javasscript:" onClick={this.showModal.bind(null, 'edit', v.id)}>{Language['edit']}</a>
          <a className="del-menu" href="javasscript:" onClick={this.delRule.bind(null, v.id)} >{Language['del']}</a>
          {
            v.enabled
              ? <a
                  className="disabled-menu"
                  href="javasscript:"
                  onClick={this.toggleRuleStatus.bind(null, v.id, false)}
                >
                  {Language['disable']}
                </a>
              : <a
                  className="enabled-menu"
                  href="javasscript:"
                  onClick={this.toggleRuleStatus.bind(null, v.id, true)}
                >
                  {Language['enable']}
                </a>
          }
        </div>
      )
    }];
    const typeEnum = {
      0: Language['dns-analysis'],
      1: Language['request-forward'],
      2: Language['custom-response'],
      3: Language['custom-script']
    };
    const { checked, listData, visible, ruleType, action, ruleData } = this.state;
    const isEdit = action === 'edit';

    return (
      <div className="rules-page">
        <div className="header">
          <Switch checked={checked} onChange={this.toggleChecked}>
            {checked ? Language['disable'] : Language['enable']}
            {
              checked ?  <span className="help-tips enabled">{Language['enabled-desc']}</span> : <span className="help-tips disabled">{Language['disabled-desc']}</span>
            }
          </Switch>
          <Button onClick={this.showModal.bind(null, 'add')}><Icon type="add" />{Language['create']}</Button>
        </div>
        <div className={`rule-list ${checked ? '' : 'disabled'}`}>
          <div className="list-header list-tr">
            {columns.map(v => (<div key={v.key} className="th" style={{ width: v.width }}>{v.title}</div>))}
          </div>
          <div className="list-body">
            {listData.length ? listData.map((v, i) => (
              <div className="list-tr" key={i}>
                {
                  columns.map(({ render, width, key }) => (
                    <div
                      className="td"
                      key={key}
                      style={{ width }}
                    >
                      {render ? render(v[key], v, i) : v[key]}
                    </div>
                  ))
                }
              </div>
            )) : <div className="empty">{Language['empty']}</div>}
          </div>
        </div>
        <Modal
          title={isEdit ? Language['modal-eidt-title'] : Language['modal-add-title']}
          className="create-modal"
          visible={visible}
          width="780"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <ItemRow name={Language['rule-type']}>
            <Select value={ruleType} onChange={this.handleRuleType} width="220" disable={isEdit}>
              <Option value="0">{Language['dns-analysis']}</Option>
              <Option value="1" >{Language['request-forward']}</Option>
              <Option value="2">{Language['custom-response']}</Option>
              <Option value="3">{Language['custom-script']}</Option>
            </Select>
          </ItemRow>
          {ruleType  && <RulePicker type={ruleType} value={ruleData} onChange={this.handleRuleData} />}
        </Modal>
      </div>
    );
  }
}

export default Rules;
