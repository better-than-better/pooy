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

export {
  param2string,
  getField,
  filterSize,
  throttle
}