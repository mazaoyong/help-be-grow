import React from 'react';
import getUrl from '../../../utils/url';
import fullfillImage from '@youzan/utils/fullfillImage';
import formatMoney from '@youzan/utils/money/format';
import mapKeysToCamelCase from '@youzan/utils/string/mapKeysToCamelCase';
import baseConfig from './base';

export default function(config) {
  return baseConfig({
    title: '选择直播',
    url: getUrl('/ump/paidcontent/lives.json', 'www', config.url),
    columns: [
      // 表格
      {
        title: '直播名称',
        width: '50%',
        bodyRender: item => {
          return (
            <div className="rc-choose-dialog-paid-goods">
              <div className="rc-choose-dialog-paid-goods--cover">
                <img alt={item.summary} src={fullfillImage(item.cover, '!100x100.jpg')} />
              </div>
              <div className="rc-choose-dialog-paid-goods--desc">
                <a
                  href={item.liveDetailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rc-choose-dialog-one-line"
                >
                  {item.title}
                </a>
                <div className="rc-choose-dialog-paid-goods--price">
                  ￥{formatMoney(item.price)}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        title: '创建时间',
        width: '50%',
        name: 'createdAt',
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
      const { list = [] } = data;
      return {
        data: list.map(item => mapKeysToCamelCase(item)),
        pageSize: 5,
        total: data.total,
      };
    },
  });
}
