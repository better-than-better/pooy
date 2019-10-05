import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Icon from '@components/icon';
import './index.pcss';

let div = document.createElement('div');

const MessageContent = (props) => {
  const { type, text, visible } = props;

  return (
    <div className={`global-message ${visible ? 'visible' : ''}`}>
      <Icon type={type} />
      {text}
    </div>
  );
};

window.React = React;
window.ReactDOM = ReactDOM;

let timer = null;

const message = new Proxy({}, {
  get(target, key, receiver) {
    const validKeys = ['success', 'fail', 'warning', 'info'];

    if (!validKeys.includes(key)) return;

    return (text) => {
      document.body.appendChild(div);

      clearTimeout(timer);
      timer = null;

      timer = setTimeout(() => {
        ReactDOM.render((
          <MessageContent type={key} text={text} root={div} visible={false} />
        ), div);
        ReactDOM.unmountComponentAtNode(div);
        clearTimeout(timer);
        timer = null;
      }, 2500);

      return ReactDOM.render((
        <MessageContent type={key} text={text} root={div} visible />
      ), div);
    }
  }
});

window.message = message;

export default message;