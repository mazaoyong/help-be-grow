import React from 'react';

import './index.scss';

// 新增 imgHeight 参数，预设 img 标签高度，用于解决在 pop 组件中 position 不准确问题
export default function openDemo(img, text, imgHeight) {
  return (
    <div className="demo-dialog">
      <div className="demo-dialog__text">{text}</div>
      <div className="demo-dialog__img">
        <img src={img} style={{ height: imgHeight ? `${imgHeight}px` : 'auto' }} />
      </div>
    </div>
  );
}
