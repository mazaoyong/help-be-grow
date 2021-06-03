// 海报推广
import React, { Component } from 'react';
import { Notify } from 'zent';
import { popularizePosterActive } from '../api';

// 图片链接生成 base64
function getBase64(url) {
  let canvas = document.createElement('canvas'); // 创建canvas DOM元素
  let ctx = canvas.getContext('2d');
  let img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = url;
  return new Promise(resolve => {
    img.onload = function() {
      canvas.height = img.height; // 指定画板的高度,自定义
      canvas.width = img.width; // 指定画板的宽度，自定义
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // 参数可自定义
      let dataURL = canvas.toDataURL();
      canvas = null;
      resolve(dataURL); // 回掉函数获取Base64编码
    };
  }).catch(() => {
    Notify.error('生成海报下载地址失败');
  });
}

export default class Promotion extends Component {
  state = {
    previewUrl: '',
    downloadUrl: '',
  };

  componentDidMount() {
    this.getPoster(this.props.id);
  }

  // 推广海报
  getPoster = id => {
    popularizePosterActive(id)
      .then(data => {
        getBase64(data).then(dataUrl => {
          // 得到base64的内容 data:MIME_TYPE/MIME_EXT,BASE-64__CONTENT
          const arr = dataUrl.split(',');
          // 获取mime
          const mime = arr[0].match(/:(.*?);/)[1];
          /**
           * 将base64字符串内容转成ArrayBuffer
           * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#Appendix.3A_Decode_a_Base64_string_to_Uint8Array_or_ArrayBuffer
           * base64 encoding and decoding
           * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
           */
          const bStr = atob(arr[1]);
          let n = bStr.length;
          const unit8Array = new Uint8Array(n);
          while (n--) {
            unit8Array[n] = bStr.charCodeAt(n);
          }
          const blob = new Blob([unit8Array], { type: mime });
          this.setState({
            previewUrl: dataUrl,
            downloadUrl: URL.createObjectURL(blob),
          });
        });
      })
      .catch(({ msg }) => {
        Notify.error(msg);
      });
  };

  render() {
    const { previewUrl, downloadUrl } = this.state;
    let style = {
      backgroundImage: `url(${previewUrl})`,
      height: '266px',
      backgroundSize: '100% 100%',
    };

    return (
      <div className="promotion-wrapper">
        <div className="promotion">
          <div className="promotion__img" style={previewUrl ? style : {}} />
        </div>
        <div className="down-link">
          {downloadUrl !== '' ? (
            <a href={downloadUrl} download="poster">
              下载海报
            </a>
          ) : null}
        </div>
      </div>
    );
  }
}
