import React from 'react';
import ReactDOM from 'react-dom';
import I18N from '@i18n';
import { getLan } from '@helper/utils';

import Icon from '@components/icon';
import './index.pcss';

class Modal extends React.PureComponent{
  state = {
    visible: this.props.visible
  }

  div = document.createElement('div')

  static getDerivedStateFromProps({ visible }, state) {
    if (state.visible !== visible) {
      return { visible };
    }

    return null;
  }

  componentDidMount() {
    document.body.appendChild(this.div);
  }

  componentWillUnmount() {
    document.body.removeChild(this.div);
  }

  handleClose = () => {
    const { onClose } = this.props;

    if (onClose) {
      onClose();
    } else {
      this.setState({ visible: false });
    }
  }

  handleOk = () => {
    this.props.onOk && this.props.onOk();
  }

  handleCancel = () => {
    this.props.onCancel && this.props.onCancel();
  }

  render() {
    const Language = I18N[getLan()].global;
    const { visible } = this.state;
    const { title, children, okText = Language['confirm'], cancelText = Language['cancel'], showCloseIcon, className, width } = this.props;

    return visible ? ReactDOM.createPortal((
      <div className={`modal-wrapper ${className}`}>
        <div className="modal-inner" style={{ width: +width }}>
          <div className="modal-header">
            <h1>{title}</h1>
            {showCloseIcon && <Icon type="close close-icon" onClick={this.handleClose} />}
          </div>
          <div className="modal-content">{children}</div>
          <div className="modal-footer">
            <button onClick={this.handleCancel}>{cancelText}</button>
            <button onClick={this.handleOk}>{okText}</button>
          </div>
        </div>
      </div>
    ), this.div) : null;
  }
}

Modal.defaultProps = {
  title: 'untitle',
  showCloseIcon: false,
  className: ''
};

export default Modal;
