/**
 * 异步请求， 使用fetch API
 * IE下使用polyfill
 */
import 'whatwg-fetch';
import { param2string } from './utils';


function _request(url, options = {}, json = true) {

  // 携带cookie
  options = Object.assign({
    // credentials: 'include',
    mode: 'cors'
  }, options);

  return fetch(url, options).then(res => {
    if (res.status < 200 || res.status >= 300) {
      let err = new Error(res.statusText);

      err.response = res;
      throw err;
    }
    return json ? res.json() : res.text();
  }).catch((err) => {
    return {
      error: {
        status: false,
        message: `内部错误，${err.message}。`
      }
    }
  });
}

function get(url, options = {}, json) {
  if (!url) { url = '/'; }

  if (!options) {
    options = {};
  }

  options.method = 'GET';

  if (typeof options.params === 'object') {
    options.params = param2string(options.params);
  }

  if (options.params) {
    if (url.indexOf('?') < 0) {
      url += `?${options.params}`;
    } else {
      url += `&${options.params}`;
    }
  }

  delete options.params;

  return _request(url, options, json);
}

function post(url, options = {}) {
  if (!url) { url = '/'; }

  options.method = 'POST';

  options = Object.assign({
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }, options);

  if (options.headers['Content-Type'] === 'application/x-www-form-urlencoded' && typeof options.body === 'object') {
    options.body = param2string(options.body);
  }

  return _request(url, options);
}

function postForm(url, options = {}) {
  if (!url) { url = '/'; }
  options.method = 'POST';
  let formData = new FormData();

  Object.keys(options.body).forEach(key => {
    formData.append(key, options.body[key]);
  });

  options.body = formData;

  return _request(url, options);
}

function postJSON(url, options = {}) {
  options.headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  options.body = JSON.stringify(options.body);

  return post(url, options);
}

export {
  get,
  post,
  postForm,
  postJSON
};