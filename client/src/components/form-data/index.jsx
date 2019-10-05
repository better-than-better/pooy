import React from 'react';
import LabelItem from '@components/label-item';
import './index.pcss';

const FormData = ({ data, boundary }) => {
  if (!data) return null;

  const d = JSON.parse(data);

  console.log(d);

  function renderOne(filed, values) {
    return values.map((v, i) => typeof v === 'string' ? (
      <LabelItem key={i} name={filed} value={v} />
    ): (
      <div key={i}>
        <p>
          <span>{filed}: </span>
          <span>{v.originalFilename}</span>
        </p>
      </div>
    ));
  }

  return (
    <div className="form-data">
      {Object.keys(d).map(key => renderOne(key, d[key]))}
    </div>
  );
};

export default FormData;
