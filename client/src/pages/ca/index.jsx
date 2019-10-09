import React, { useState, useEffect } from 'react';
import I18N from '@i18n';
import { getLan } from '@helper/utils';
import QRCode from 'qrcode';
import API from '@api';
import './index.pcss';

const CA = () => {
  const Language = I18N[getLan()].ca;
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
  };

  useEffect(() => {
    fetchRootCA();
  }, [null]);

  return (
    <div className="ca-wrapper">
      <img src={qrcodeImg} alt="qrcode" />
      <p>{Language['help-tips']}<a href={rootCA}>{rootCA}</a></p>
    </div>
  );
};

export default CA;
