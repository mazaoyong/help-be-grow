import React from 'react';
import baseConfig from './base-config';
import Image from '@youzan/ebiz-image';

export default function() {
  return baseConfig({
    title: '选择老师',
    url: `${_global.url.base}/v4/vis/edu/shop/listTeacherForWym.json`,
    columns: [
      // 表格
      {
        title: '老师姓名',
        width: '40%',
        bodyRender: item => {
          return (
            <div className="rc-choose-dialog-paid-goods">
              <div className="rc-choose-dialog-paid-goods--cover">
                <Image src={item.icon} alt={item.description} width="110px" height="62px" />
              </div>
              <div className="rc-choose-dialog-paid-goods--desc">{item.staffName}</div>
            </div>
          );
        },
      },
      {
        title: '昵称',
        width: '30%',
        name: 'teacherName',
      },
      {
        title: '职务描述',
        width: '30%',
        name: 'duty',
      },
    ],
    buildQuery(data) {
      return {
        title: data.search,
        page: data.page,
        page_size: 5,
      };
    },
    formatData(data) {
      return {
        data: data.content,
        pageSize: 5,
        total: data.total,
      };
    },
  });
}
