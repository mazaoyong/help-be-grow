import React, { Fragment } from 'react';
import { Button } from 'zent';
import get from 'lodash-es/get';

import { CHANNEL_TEXT_MAPPING } from '../../common/constants';

const getGoodsLength = data => {
  let length = 0;

  Object.values(data).forEach(item => {
    // 多 SKU
    if (item.isSku) {
      length += get(item, 'skuInfo.sku', []).length;
    } else {
      length += 1;
    }
  });

  return length;
};

export default function Footer(props) {
  return (
    <div className="rc-goods-sku-selector__footer">
      <div className="rc-goods-sku-selector__footer-prefix">
        <span className="key">已选：</span>
        <span className="text">
          {props.channels.map((channel, index) => {
            return (
              <Fragment key={channel}>
                {`${CHANNEL_TEXT_MAPPING[channel]}`}
                <span className="num">{getGoodsLength(props.selected[channel])}</span>
                {`${index !== props.channels.length - 1 ? '、' : ''}`}
              </Fragment>
            );
          })}
        </span>
      </div>
      <Button onClick={props.onCancel}>取消</Button>
      <Button type="primary" onClick={props.onConfirm}>
        确定
      </Button>
    </div>
  );
}
