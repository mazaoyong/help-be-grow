/**
 * 图片链接转为 base64
 * @export
 * @param {string} url - 图片链接
 * @returns {Promise<string>} - base64 promise
 */
export default function transToBase64(url: string): Promise<string> {
  if (/yzcdn/.test(url)) {
    // 图片转为 jpeg 格式
    url += '?imageView2/0/format/jpeg'; // 图片格式转为 jpeg 格式
  }

  const canvas: HTMLCanvasElement = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = url;

  return new Promise((resolve, reject) => {
    img.onload = () => {
      canvas.height = img.height;
      canvas.width = img.width;
      ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL('image/jpeg');
      resolve(dataURL);
    };

    img.onerror = e => {
      reject(e);
    };
  });
}
