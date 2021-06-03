import React from 'react';
import './index.scss';
import fullfillImage from 'zan-utils/fullfillImage';

export default function SchoolConfigHeader(props) {
  const {
    isShowConfig = false,
    id,
    title,
    skuSize,
    price,
    shortenUrl,
    courseType,
    formalCourseDTO,
    totalStock,
    pictureWrapDTO = {},
    picUrl = '',
    alias,
  } = props;
  const { courseSellType } = formalCourseDTO || {};
  const picture = fullfillImage(picUrl || pictureWrapDTO.url, '!100x100.jpg');
  return (
    <div className="coursebranch-head-layout">
      <div className="coursebranch-head-wrap">
        <div className="coursebranch-image-wrap">
          <img className="coursebranch-image-blur" src={picture} />
          <img className="coursebranch-image" src={picture} />
        </div>
        <div className="coursebranch-info-wrap">
          <div
            onClick={() => window.open(`${shortenUrl}&kdt_id=${_global.kdtId}`)}
            className="coursebranch-name"
          >
            {title}
          </div>
          <div className="coursebranch-price">¥ {price / 100}</div>
          <div>名额：{totalStock || '-'}</div>
        </div>
      </div>
      {isShowConfig && (
        <div
          onClick={() => {
            window.open(
              `course#/course-manage/schools/${id}?title=${title}&alias=${alias}&skuSize=${skuSize}&price=${price}&shortenUrl=${shortenUrl}&isClassCourse=${
                courseType === 1 && courseSellType === 3 ? 1 : 0
              }&totalStock=${totalStock}&id=${id}&picUrl=${
                pictureWrapDTO ? pictureWrapDTO.url : ''
              }`,
            );
          }}
          className="coursebranch-show-config"
        >
          去设置
        </div>
      )}
    </div>
  );
}
