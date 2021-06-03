import React from 'react';

import getUrl from '@youzan/react-components/es/components/choose-dialog/url';
import '@youzan/react-components/es/components/choose-dialog/style';
import Image from '@youzan/ebiz-image';

export default function getConfig(config) {
  return {
    title: '选择直播',
    needCrossPage: true,
    multiple: true,
    url: getUrl('/ump/paidcontent/lives.json', 'www', config.url),
    columns: [
      // 表格
      {
        title: '直播名称',
        width: '50%',
        bodyRender: item => {
          return (
            <div className="live-item-select">
              <div className="live-item-select__cover">
                <Image src={item.cover} alt={item.summary} width="110px" height="62px" />
              </div>
              <div className="live-item-select__content">
                <div className="live-item-select__content__name">{item.title}</div>
              </div>
            </div>
          );
        },
      },
      {
        title: '创建时间',
        width: '50%',
        name: 'created_at',
      },
    ],
    buildQuery(data) {
      return {
        title: data.search,
        page: data.page,
        page_size: 6,
      };
    },
    formatData(data) {
      return {
        data: data.list,
        pageSize: 6,
        total: data.total,
      };
    },
    actions: [
      {
        type: 'search',
        align: 'right',
      },
    ],
  };
}
