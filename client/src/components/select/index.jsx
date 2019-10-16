import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import I18N from '@i18n';
import { getLan, throttle, getAbsolutePos } from '@helper/utils';

import Icon from '@components/icon';
import './index.pcss';

const Option = ({ value, selected, children, onClick }) => {
  return (
    <div className={`option ${selected ? 'selected' : ''}`} onClick={onClick} value={value}>{children.toString()}</div>
  );
};

Option.propTypes = {
  children: PropTypes.string
};

const filterValue = (val, multiple) => {
  const s = v => v !== undefined ? [v] : [];

  if (!multiple) return s(val).map(v => v.toString())

  return (Array.isArray(val) ? val : s(val)).map(v => v.toString());
};

class Select extends React.PureComponent {
  state = {
    active: false,
    value: filterValue(this.props.value, this.props.multiple)
  }

  static getDerivedStateFromProps({ value, multiple, onChange }, state) {
    if (value === state.value || !onChange) return null;

    return {
      value: filterValue(value, multiple)
    };
  }

  componentDidMount() {
    window.addEventListener('click', this.handleClick, false);
    window.addEventListener('resize', this.handlePosChange, false);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleClick, false);
    window.removeEventListener('resize', this.handlePosChange, false);
  }

  initOptionsContainer() {
    const { active } = this.state;
    const pos = getAbsolutePos(document.body, this.selectDOM);
    const selectOptionsContainer = pos.ref;

    if (active) {
      this.selectOptionsDOM = this.selectOptionsDOM || document.createElement('div');
      this.selectOptionsDOM.style = `
        position: absolute;
        top: ${pos.top + pos.height + 4}px;
        left: ${pos.left}px;
        z-index: 999;
      `;
  
      if (!selectOptionsContainer.contains(this.selectOptionsDOM)) {
        selectOptionsContainer.appendChild(this.selectOptionsDOM);
      }
    } else {
      if (selectOptionsContainer.contains(this.selectOptionsDOM)) {
        selectOptionsContainer.removeChild(this.selectOptionsDOM)
      }
      this.selectOptionsDOM = null;
    }
  }

  createProps = () => {
    const props = {...this.props, children: [] };
    const { value } = this.state;

    this.props.children.forEach((v) => {
      const child = {...v};
  
      child.props = {
        ...v.props,
        onClick: this.handleValue.bind(null, v.props.value),
        selected: value.includes(v.props.value),
      };
  
      props.children.push(child);
    });

    return props;
  }

  handleValue = (val) => {
    const { multiple, onChange } = this.props;
    const { value } = this.state;

    if (!multiple && val === value[0]) return;

    let newVal = [];

    if (value.includes(val)) {
      newVal = value.filter(v => v !== val);
    } else {
      newVal = [...value, val];
    }

    const v = multiple ? newVal : newVal[newVal.length - 1];

    onChange ? onChange(v) : this.setState({ value: v });
  };

  /**
   * 关闭下拉选项
   */
  handleClick = (e) => {
    if (this.props.multiple && /^option/.test(e.target.className)) return;

    this.setState({ active: false });
  }

  handlePosChange = throttle(() => {
    this.initOptionsContainer()
  }, 20)

  toggleActive = (e) => {
    if (/^(val-item|pooy-icon)/.test(e.target.className) && this.props.multiple) return;
    e.stopPropagation();
    this.setState({ active: !this.state.active });
  }

  filterName = (val, props) => {
    const option = props.children.filter(v => val.includes(v.props.value));

    const arr = [];

    val.forEach(x => {
      const obj = props.children.find(y => x === y.props.value);

      if (obj) {
        arr.push(obj)
      }
    });

    return arr.length ? arr.map((v, i) => (
      <span className="val-item" key={i}>
        {v.props.children.toString()}
        {props.multiple && <Icon type="close1" onClick={this.removeItem.bind(null, v.props.value)} />}
      </span>
    )) : '';
  }

  removeItem = (val) => {
    this.handleValue(val);
  }

  render() {
    const Language = I18N[getLan()].global;
    const props = this.createProps();
    const { disable, multiple, placeholder, children } = props;
    const { active, value } = this.state;
    const width = props.width ? +props.width : null;

    this.initOptionsContainer();

    return (
      <div className={`pooy-select ${multiple ? 'multiple-select' : ''} ${active ? 'active' : ''} ${disable ? 'disabled' : ''}`} ref={ref => this.selectDOM = ref}>
        <div className="select-val" onClick={this.toggleActive} style={{ width }}>
          {value.length ? this.filterName(value, props) : (
            <span className="placeholder">
              {
                placeholder || Language['select-placeholder']
              }
            </span>
          )}
          <Icon type="down" />
        </div>
        {
          active && ReactDOM.createPortal((
            <div className="pooy-select-options" style={{ width }}>
              {children}
            </div>
          ), this.selectOptionsDOM)
        }
      </div>
    );
  }
}

Select.Option = Option;

Select.propTypes = {
  multiple: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array
  ]),
  placeholder: PropTypes.string,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};

export default Select;
