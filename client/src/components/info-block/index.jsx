import React, { useState } from 'react';
import PropTypes from 'prop-types';
import LabelItem from '@components/label-item';
import './index.pcss';

const InfoBlock = ({ title, data, noSort, source, noSource, render }) => {
  let ref = null;

  const [ viewMode, setViewMode ] = useState('parsed');
  const handleViewMode = () => {
    if (viewMode === 'parsed') {
      setViewMode('source');
    } else {
      setViewMode('parsed');
    }
  };

  const isSourceMode = viewMode === 'source';

  if (render) {
    return (
      <div className={`info-block ${isSourceMode ? 'source-mode' : ''}`}>
        <div className="header">{title}</div>
        <div className="content" ref={r => ref = r}>{render()}</div>
      </div>
    );
  }

  return (
    <div className={`info-block ${isSourceMode ? 'source-mode' : ''}`}>
      <div className="header">{title} {!noSource && <span onClick={handleViewMode}>view {isSourceMode ? 'parsed' : 'source'}</span>}</div>
      {
        isSourceMode
          ? <div
            className="content"
            dangerouslySetInnerHTML={{__html: source ? `<p>${source}</p>` : Object.keys(data).map(key => `<p>${key}:${data[key]}</p>`).join('')}}
            contentEditable="true"
            ref={r => ref = r}
            suppressContentEditableWarning
          />
          : <div className="content" ref={r => ref = r}>
              {(noSort ? Object.keys(data) : Object.keys(data).sort()).map(key => (<LabelItem key={key} name={key} value={data[key]} />))}
          </div>
      }
    </div>
  );
};

InfoBlock.defaultProps = {
  title: '',
  data: {},
  noSort: false
};

InfoBlock.propTypes = {
  title: PropTypes.string,
  data: PropTypes.object,
  noSort: PropTypes.bool,
  noSource: PropTypes.bool,
  render: PropTypes.func
};

export default InfoBlock;
