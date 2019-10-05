import React, { useState, useEffect } from 'react';
import prettyWorker from '@/pretty.worker.js';
import './index.pcss';

const worker = new prettyWorker();

worker.addEventListener('message', (e) => {
    window.setHtmlstr && window.setHtmlstr(e.data);
}, false);

const CodePreview = ({ value, language }) => {
    const [ htmlstr, setHtmlstr ] = useState('格式化中...');

    useEffect(() => {
        setHtmlstr(value ? '格式化中...' : '没有响应体');
        if (!value) return;
        worker.postMessage({ str: value, language });
        window.setHtmlstr = setHtmlstr;

        return () => {
            window.setHtmlstr = null;
        };
    }, [value]);

    return (
        <div
            className="code-preview"
            dangerouslySetInnerHTML={{__html: htmlstr }}
        />
    );
};

CodePreview.defaultProps = {
    value: '',
    language: 'html'
};

export default CodePreview;

