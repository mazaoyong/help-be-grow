const parseUrl = (src, isGifOptimation) => {
  const regex = /\.([^.!]+)!([0-9]{1,4})x([0-9]{1,4})q?([0-9]{0,2}|100)?(\+2x)?\..+/;
  let x2 = 1;

  const paras = src.match(regex);

  // gif需要加上这样的后缀才能保证不模糊，例如：imageView2/2/w/730/h/0/format/gif/unoptimize/1
  const gifPostfix = isGifOptimation ? 'gif/unoptimize/1' : '';

  if (paras && paras.length >= 4) {
    if (paras[5] === '+2x') {
      x2 = 2;
    }
    const isGif = paras[1] === 'gif' ? gifPostfix : paras[1];
    const _query = 'imageView2/2/w/' + parseInt(paras[2], 10) * x2 + '/h/' + parseInt(paras[3], 10) * x2 + '/q/' + (paras[4] || 75) + '/format/' + (paras[1] === 'webp' ? 'jpg' : isGif);
    src = src.replace(regex, '.') + paras[1] + '?' + encodeURIComponent(_query); // 如果不支持webp且是webp图片，则强制转换成jpg
  }
  return src;
};

const fullfillImage = (url, rule, options = {}) => {
  if (!url) return;
  if (url.match(/^data:/i)) return url;

  const imgcdn = options.imgcdn || options.imgqn || 'https://img01.yzcdn.cn';

  // 使用过的域
  const DOMAIN_REG_ARRAY = [/^(https?:)?\/\/imgqn.koudaitong.com/, /^(https?:)?\/\/kdt-img.koudaitong.com/, /^(https?:)?\/\/img01.yzcdn.cn/, /^(https?:)?\/\/dn-kdt-img.qbox.me/];

  rule = rule || '';

  for (let i = 0; i < DOMAIN_REG_ARRAY.length; i++) {
    // 并不是所有的域都支持HTTPS，所以把这些域替换成支持HTTPS的
    url = url.replace(DOMAIN_REG_ARRAY[i], imgcdn);
  }

  // 测试环境下的域名
  url = url.replace('imgqntest.koudaitong.com', 'dn-kdt-img-test.qbox.me');

  if (!url.match(/^(https?:)?\/\//i)) {
    url = imgcdn + '/' + url + rule;
  } else if (url.match(imgcdn) || url.match('dn-kdt-img-test.qbox.me')) {
    if (!url.match('!')) {
      url = '' + url + rule;
    }
  } else {
    return url;
  }

  url = parseUrl(url, options.isGifOptimation);

  return url;
};

export default fullfillImage;
