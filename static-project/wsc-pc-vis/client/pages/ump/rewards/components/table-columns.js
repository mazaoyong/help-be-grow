import React from 'react';
import fullfillImage from 'zan-utils/fullfillImage';

export const CourseColumns = (onGoodsDelete, disabled) => {
  const columns = [{
    title: '商品',
    width: '600px',
    textAlign: 'left',
    bodyRender: (data) => {
      const picture = fullfillImage(data.picURL, '!60x60.jpg');
      return (
        <div className='reward-course-column-wrap'>
          <div className='reward-course-image-wrap'>
            <img className='reward-course-image-blur' src={picture} />
            <img className='reward-course-image' src={picture} />
          </div>
          <div className='reward-course-words'>
            <a onClick={() => window.open(data.url)}> { data.courseName } </a>
            <div style={{ color: '#ff6600' }}>{`¥${data.price / 100}`}</div>
          </div>
        </div>
      );
    },
  }];
  if (!disabled) {
    columns.push({
      title: '操作',
      width: '60px',
      bodyRender: () => {
        return (
          <span className='reward-course-operation' onClick={onGoodsDelete}>删除</span>
        );
      },
    });
  }
  return columns;
};
