import React, { useState, useEffect } from 'react';
import I18N from '@i18n';
import { getLan } from '@helper/utils';
import QRCode from 'qrcode';
import API from '@api';
import './index.pcss';

const CA = () => {
  const Language = I18N[getLan()].ca;
  const [ data, setData ] = useState({});
  const [ rootCA, setRootCA ] = useState();
  const [ qrcodeImg, setQrcodeImg ] = useState();

  const fetchRootCA = async () => {
    const res = await API.fetchRootCA();

    if (res.error) return;

    const caPath = `http://${res.host}${res.path}`;

    QRCode.toDataURL(caPath, (err, qrcodeImg) => {
      if (err) return;

      setQrcodeImg(qrcodeImg);
    });

    setRootCA(caPath);
    setData(res);
  };

  useEffect(() => {
    fetchRootCA();
  }, [null]);

  return (
    <div className="ca-wrapper">
      <img src={qrcodeImg} alt="qrcode" />
      <p>1. {Language['set-proxy']}: <a href="javascript:">{data.IPv4}:{data.port}</a></p>
      <p>2. {Language['help-tips']} <a href={rootCA}>{rootCA}</a></p>
    </div>
  );
};

export default CA;
