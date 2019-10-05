import React from 'react';
import CodePreview from '@components/code-preview';
import ImagePreview from '@components/image-preview';
import JSONPreview from '@components/json-preview';
import { getField } from '@helper/utils';
import './index.pcss';

const filterType = (contentType) => {
  if (/html/.test(contentType)) return 'html';

  if (/css/.test(contentType)) return 'css';

  if (/javascript/.test(contentType)) return 'js';

  if (/json/.test(contentType)) return 'json';

  if (/image/.test(contentType)) return 'image';

  if (/video/.test(contentType)) return 'video';

  if (/audio/.test(contentType)) return 'audio';

  if (/font/.test(contentType)) return 'font';

  if (/xml/.test(contentType)) return 'xml';

  return 'text';
};

const ResponsePreview = ({ data, resData, originalSrc, loading }) => {
  if (!resData.statusCode) return <div className="pending-body">{resData.error ? `请求失败: ${resData.error.message}` : '等待响应'}</div>;

  const contentType = getField(resData.headers, 'content-type');
  const contentLen = getField(resData.headers, 'content-length');
  const type = filterType(contentType);
  let content = null;

  if (type === 'image') {
    content = (<ImagePreview src={data} contentType={contentType} originalSrc={originalSrc} size={contentLen} />);
  } else if (type === 'json') {
    let d = {};

    try {
        d = JSON.parse(data);
    } catch (err) {
      try {
        data = JSON.parse(data.match(/.*?({.*}).*/)[1]);
      } catch (err) {
        // console.log(err);
      }
    }
    content = (<JSONPreview data={d} />);
  } else if (['audio', 'video'].includes(type)) {
    content = (
      <div className="media-preview">
        <video controls src={data} name="media">
          <source src={data} type={contentType} />
        </video>
      </div>
    );
  } else if (['font', 'pdf'].includes('type')) {
    content = `不支持的预览类型:${type}`;
  } else {
    content = (<CodePreview value={data} language={type} />)
  }

  return (
    <div className="response-preview-wrapper">
      {loading ? 'loading...' : content}
    </div>
  );
}

export default ResponsePreview;