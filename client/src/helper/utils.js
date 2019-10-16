const param2string = (params) => {
  let ps = Object.keys(params).map(key => {
    const value = (params[key] === undefined || params[key] === null) ?  '' : params[key];

    return `${key}=${value}`;
  });

  return ps.join('&');
};

const getField = (data, filed) => {
  if (typeof data !== 'object') return null;
  return data ? data[filed] : null;
};

const filterSize = (contentLength) => {
  const compressSize = contentLength / 1024;

  if (isNaN(compressSize)) return '-';

  if (contentLength < 1024) return contentLength + 'b';

  if (compressSize > 512) return (compressSize / 1024).toFixed(1) + 'M';

  return compressSize.toFixed(1) + 'kb';
};


/**
 * 节流控制
 * @param {Function} fn
 * @param {Number} sliceTime
 */
const throttle = function throttle(fn, sliceTime = 200) {
  let before = Date.now();

  return (...arg) => {
      const now = Date.now();

      if (now - before < sliceTime) return;

      before = now;
      fn(...arg);
  };
};

/**
 * 获取语言
 * @param {String} lan
 * @return {String}
 */
const setLan = (lan = 'en') => {
  localStorage.setItem('pooy:lan', lan);
  window.updateLayout && window.updateLayout();
  return lan;
}

/**
 * 获取语言
 * @return {String}
 */
const getLan = () => {
  return localStorage.getItem('pooy:lan') || 'en';
}

/**
 * 获取某元素相对某父节点的位置(如果遇到 offsetParent 为 fixed 的情况不在继续)
 * @param {Element} ref 
 * @param {Element} target 
 */
const getAbsolutePos = (ref, target) => {
  if (!target) return {
    ref,
    width: 0,
    height: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };

  const pos = {
    width: target.clientWidth,
    height: target.clientHeight,
    top: -target.clientTop,
    left: -target.clientLeft
  };
  
  let node = target;

  while(node != ref && node) {
    pos.left = pos.left + node.offsetLeft;
    pos.top = pos.top + node.offsetTop + node.clientTop;
    node = node.offsetParent;

    if (node && getComputedStyle(node).position === 'fixed') {
      ref = node;
    }
  }

  if(isNaN(ref.scrollLeft)){
    pos.right = document.documentElement.scrollWidth - pos.left;
    pos.bottom = document.documentElement.scrollHeight - pos.top;
  } else {
    pos.right = ref.scrollWidth - pos.left;
    pos.bottom = ref.scrollHeight - pos.top;
  }

  pos.ref = node;
  return pos;
};

const getPageEnv = () => {
  let env = 'web';

  if (window.process && window.process.versions && window.process.versions.electron) {
    env = 'electron';
  }

  return env;
};

export {
  param2string,
  getField,
  filterSize,
  throttle,
  setLan,
  getLan,
  getAbsolutePos,
  getPageEnv
}