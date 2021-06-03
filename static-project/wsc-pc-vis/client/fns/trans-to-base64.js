/**
 * 图片链接转为 base64
 *
 * @param {string} url URL
 * @return {Promise<string>}
 */
export default function transToBase64(url) {
  if (/yzcdn/.test(url)) {
    url += '?imageView2/0/format/jpeg'; // 图片格式转为 jpeg 格式
  }
  let canvas = document.createElement('canvas'); // 创建canvas DOM元素
  let ctx = canvas.getContext('2d');
  let img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = url;

  return new Promise(resolve => {
    img.onload = function() {
      canvas.height = img.height; // 指定画板的高度
      canvas.width = img.width; // 指定画板的宽度
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      let dataURL = canvas.toDataURL('image/jpeg');
      canvas = null;
      resolve(dataURL);
    };
  });
}
