import React, { useState } from 'react';
import './index.pcss';

const KeyValue = ({ data }) => {
  let value = data.value;
  let cls = '';
  const valueType = typeof value;

  if (valueType === 'string') {
    value = `"${value}"`;
    cls = 'str';
  }

  if (valueType === 'undefined' || value === null || valueType === 'boolean') {
    value = `${value}`;
    cls = 'null';
  }

  if (valueType === 'boolean') {
    cls = 'bool';
  }

  if (valueType === 'number') {
    cls = 'num';
  }

  return (
    <div className="key-value">
      <span className="key">{data.key}</span>
      <em>:</em>
      <span className={`value ${cls}`}>{value}</span>
    </div>
  );
};

const SingleJSONFormat = ({ keyName, data }) => {
  const [open, setOpen] = useState(0);

  const clickHandler = () => {
    setOpen(!open);
  };

  return (
    <div className="data-block">
      <i className={open ? 'open' : 'close'} onClick={clickHandler}></i>
      <div className="start" onClick={clickHandler}>
        {keyName && <><span className="key">{keyName}</span><em>:</em></>}
        <span>{JSON.stringify(data)}</span>
      </div>
      {open ? <>
        {
          Object.keys(data).sort().map((key, i) => {
            const dd = data[key];

            if (typeof dd === 'object' && dd) return (<SingleJSONFormat key={i} keyName={key} data={dd} />);

            return (<KeyValue key={i} data={{ key, value: dd }} />);
          })
        }
      </> : null}
    </div>
  );
};

const JSONFormat = (props) => (
  <div className="json-format"><SingleJSONFormat {...props} /></div>
);

export default JSONFormat;
