import React from 'react';
import { Tag } from 'zent';
import getUrl from '../../../utils/url';
import fullfillImage from '@youzan/utils/fullfillImage';
import formatMoney from '@youzan/utils/money/format';
import mapKeysToCamelCase from '@youzan/utils/string/mapKeysToCamelCase';
import baseConfig from './base';

export default function(config) {
  return baseConfig({
    title: '选择内容',
    url: getUrl('/ump/paidcontent/contents.json', 'www', config.url),
    columns: [
      {
        title: '商品',
        width: '70%',
        bodyRender(data) {
          return (
            <div className="rc-choose-dialog-paid-goods">
              <div className="rc-choose-dialog-paid-goods--cover">
                <img src={fullfillImage(data.cover, '!60x60.jpg')} alt={data.summary} />
              </div>
              <div className="rc-choose-dialog-paid-goods--desc">
                <a
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rc-choose-dialog-one-line"
                >
                  {data.title}
                </a>
                <div className="rc-choose-dialog-paid-goods--price">
                  {data.columnType === 1 && <Tag theme="green">分销</Tag>}￥{formatMoney(data.price)}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        title: '创建时间',
        name: 'publishAt',
        // needSort: true,
      },
    ],
    defaultSortBy: 'publish_at',
    defaultSortType: 'desc',
    buildQuery(data) {
      return {
        p: data.page,
        page_size: 5,
        title: data.search,
        order_by: data.sortBy,
        order: data.sortType,
        status: 1,
      };
    },
    formatData(data) {
      const { list = [] } = data;
      return {
        data: list.map(item => mapKeysToCamelCase(item)),
        pageSize: 5,
        total: data.total || 0,
      };
    },
  });
}
