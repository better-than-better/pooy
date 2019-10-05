import React from 'react';
import './index.pcss';

const CookiePreivew = ({ reqCookie, resCookie }) => {
  reqCookie = reqCookie || '';
  resCookie = resCookie || [];

  const reqCookieObj = {};
  const resCookieObj = {};

  reqCookie && reqCookie.split(';').forEach(v => {
    const o = v.split('=');

    reqCookieObj[o[0]] = o[1];
  });

  resCookie.forEach(v => {
    const arr = v.split(';');
    const o = arr[0].split('=');

    const obj = {};

    arr.forEach((v, i) => {
      const oo = v.split('=');

      if (i === 0) {
        obj.value = oo[1];
      } else {
        obj[oo[0]] = oo[1];
      }
    });

    resCookieObj[o[0]] = obj;
  });


  return (
    <div className="cookie-preview">
      <section>
        <div className="header">Response cookies</div>
        {
          Object.keys(resCookieObj).length ? Object.keys(resCookieObj).map(key => (
            <div className="row" key={key}>
              <label>{key}:</label>
              <div className="fields">
                {
                  Object.keys(resCookieObj[key]).map(v => (
                    <div className="row" key={v}>
                      <label>{v}:</label>
                      <span>{resCookieObj[key][v]}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          )) : <div className="empty">无 cookie</div>
        }
      </section>
      <section>
        <div className="header">Request cookies</div>
        {
          Object.keys(reqCookieObj).length ? Object.keys(reqCookieObj).map(key => (
            <div className="row" key={key}>
              <label>{key}:</label>
              <span>{reqCookieObj[key]}</span>
            </div>
          )) : <div className="empty">无 cookie</div>
        }
      </section>
    </div>
  );
};

CookiePreivew.defaultProps = {
  reqCookie: '',
  resCookie: []
};

export default CookiePreivew;
