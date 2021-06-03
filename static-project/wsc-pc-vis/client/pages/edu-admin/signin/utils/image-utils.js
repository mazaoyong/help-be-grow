export function loadImage(url) {
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.responseType = 'blob';

    xhr.onload = function() {
      const fr = new FileReader();

      fr.onload = function(e) {
        resolve(e.target.result);
      };

      fr.onerror = function() {
        reject();
      };

      fr.readAsDataURL(xhr.response); // async call
    };

    xhr.onerror = function() {
      reject();
    };

    xhr.send();
  });
}

export function downloadImage(url, name) {
  const a = document.createElement('a');
  const event = new MouseEvent('click');
  a.download = name || '下载图片名称';
  a.href = url;
  a.dispatchEvent(event);
}

/**
 * 移除对象中空字符串字段
 * todo 暂时只处理表层，深层次暂不做处理
 *
 * @param {Object} obj 对象
 */
export const deleteEmptyProperty = (obj = {}) => {
  const temp = Object.assign({}, obj);
  for (const key in temp) {
    if (temp[key] === '' || temp[key] === null || temp[key] === undefined) {
      delete temp[key];
    }
  }

  return temp;
};
