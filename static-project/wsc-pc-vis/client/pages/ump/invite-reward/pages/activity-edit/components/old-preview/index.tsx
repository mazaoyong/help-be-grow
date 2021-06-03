import React from 'react';
import { Swiper, Affix } from 'zent';

import './index.scss';

export const previewImagesGroup = [
  [
    '//b.yzcdn.cn/public_files/13159368aecb6d223297c6a58d9ab267.png',
    '//b.yzcdn.cn/public_files/62577c9a99a8ce35b8f3602ceb8d6648.png',
  ],
  [
    '//b.yzcdn.cn/public_files/adb866698427d5b28f8ddb92ec0b447a.png',
    '//b.yzcdn.cn/public_files/80a048fc7f6ce69f2ae8b94977af91cb.png',
  ],
  [
    '//b.yzcdn.cn/public_files/7b5771c15ec8778877f64553810fc379.png',
    '//b.yzcdn.cn/public_files/3bd3f141080c802dd26e770b70ee2093.png',
  ],
];

const OldPreview = ({ posterStyle }) => {
  return (
    <Affix offsetTop={16} placeholderClassName="preview-swiper-wrapper">
      <Swiper autoplay autoplayInterval={5000} className="preview-swiper" dotsColor="#155BD4">
        {previewImagesGroup[posterStyle - 1].map((it, index) => (
          <div key={index} className="preview-image-container">
            <img src={it} alt={`预览图${index + 1}`} />
          </div>
        ))}
      </Swiper>
    </Affix>
  );
};

export default OldPreview;
