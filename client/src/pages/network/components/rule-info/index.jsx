import React from 'react';
import Button from '@components/button';
import './index.pcss';

const RuleInfo = () => {
  return (
    <div className="rule-info">
      <p>
        <label>规则类型</label>
        <select name="" id="">
          <option value="">DNS解析</option>
          <option value="">请求转发</option>
          <option value="">响应头设置</option>
          <option value="">请求头设置</option>
          <option value="">自定义响应</option>
        </select>
      </p>
      
      <Button>新增规则</Button>
    </div>
  );
};

export default RuleInfo;
