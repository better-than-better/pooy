import React, { useState } from 'react';
import url from 'url';
import { filterSize } from '@helper/utils';
import './index.pcss';

const filterFileName = (str) => {
  if (/^\/\//.test(str)) {
    str = `https:${str}`;
  }

  const pathname = url.parse(str).pathname;
  const arr = pathname.split('/');

  return arr[arr.length - 1];
};

const getOriginalInfo = (img, src) => {
  const { naturalWidth, naturalHeight } = img;

  return new Promise((resolve, reject) => {
    // 不支持直接获取原生尺寸
    if (naturalWidth === naturalHeight && naturalHeight === undefined) {
      const image = new Image();

      image.src = src;

      // from cache
      if (image.complete) {
        const { width, height } = image;
  
        resolve({ width, height });
      } else {
        image.onload = function(e) {
          resolve({ width: image.width, height: image.height });
        }
      }
    } else {
      resolve({ width: naturalWidth, height: naturalHeight });
    }
  });
};

const ImagePreview = ({ src, contentType, originalSrc, size }) => {
  const [ imageSize, setImageSize ] = useState({});

  const handleImgLoaded = async (e) => {
    const img = e.target;
    const data = await getOriginalInfo(img, src);

    setImageSize(data);
  };

  return (
    <div className="image-preview">
      <div className="img">
        <img src={src} alt="image" onLoad={handleImgLoaded} />
      </div>
      <p><span>Size:</span>{filterSize(size)}</p>
      <p><span>Name:</span>{filterFileName(originalSrc)}</p>
      <p><span>Dimensions:</span>{imageSize.width} × {imageSize.height}</p>
      <p><span>MIME Type:</span>{contentType}</p>
    </div>
  );
}

export default ImagePreview;
