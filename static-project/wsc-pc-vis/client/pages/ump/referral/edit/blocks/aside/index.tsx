import React, { FC } from 'react';
import { Affix, Swiper } from 'zent';
import { previewImages } from '../../../constants';

import './styles.scss';

const Aside: FC<{}> = () => {
  return (
    <Affix offsetTop={16} placeholderClassName="preview-swiper-wrapper">
      <Swiper autoplay autoplayInterval={5000} className="preview-swiper" dotsColor="#155BD4">
        {previewImages.map((it, index) => (
          <div key={index} className="preview-image-container">
            <img src={it} alt={`预览图${index + 1}`} />
          </div>
        ))}
      </Swiper>
    </Affix>
  );
};

export default Aside;
