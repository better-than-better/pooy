import React from 'react';
import ReactDOM from 'react-dom';
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

  handleClick = (e) => {
    this.handleClose();
  }

  stopPropagation = (e) => {
    e.stopPropagation();
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
    const { visible } = this.state;
    const { title, children, okText, cancelText, showCloseIcon } = this.props;

    return visible ? ReactDOM.createPortal((
      <div className="modal-wrapper" onClick={this.handleClick}>
        <div className="modal-inner" onClick={this.stopPropagation}>
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
  okText: '确定',
  cancelText: '取消',
  showCloseIcon: false
};

export default Modal;
