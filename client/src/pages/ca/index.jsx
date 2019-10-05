import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import API from '@api';
import './index.pcss';

const CA = () => {
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
      <p>扫码下载根证书，或者直接访问 <a href={rootCA}>{rootCA}</a></p>
    </div>
  );
};

export default CA;
