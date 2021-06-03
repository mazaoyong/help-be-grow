import * as React from 'react';
import { Img } from '@youzan/ebiz-components';
import cx from 'classnames';
import findIndex from 'lodash/findIndex';
import { IImgUploaderPreviewProps } from './types';
import { previewImage } from 'zent';
import './style.scss';

const { ImgWrap } = Img;

const ImgUploaderPreview: React.FC<IImgUploaderPreviewProps> = (props) => {
  const handleClickImg = React.useCallback(() => {
    if (props.previewAnchor) {
      const imgels = document.querySelectorAll(`.${props.previewAnchor}`) || [];
      const imgArr = Array.prototype.slice.call<NodeListOf<Element>, any, Element[]>(imgels).map(o => {
        return (o.querySelector('.img-wrap__img')?.getAttribute('src')) || '';
      });

      previewImage({
        images: props.imgArr && props.imgArr.length ? props.imgArr : imgArr,
        index: findIndex(imgArr, o => o.search(props.url) > -1),
        scaleRatio: 3
      });
    }
  }, [props.previewAnchor, props.url]);

  const classnames = cx('img-uploader-preview', props.previewAnchor);
  return (
    <div className={classnames}
      style={
        {
          width: props.width,
          height: props.height,
        }
      }
    >
      <ImgWrap
        width={props.width}
        height={props.height}
        src={props.url}
        fullfill="!100x100.jpg"
        onClick={handleClickImg}
      />
      {
        props.showDeleteIcon && (
          <div className="img-uploader-preview__deleteIcon" onClick={props.onDelete}></div>
        )
      }
    </div>
  );
};

export default ImgUploaderPreview;
