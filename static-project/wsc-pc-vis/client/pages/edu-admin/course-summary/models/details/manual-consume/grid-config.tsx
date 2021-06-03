import React from 'react';
import { format } from 'date-fns';
import formatMoney from '@youzan/utils/money/format';
import type { IUseManualConsumeModelRes } from './types';

const FORMAT_TIME_STRING = 'YYYY-MM-DD HH:mm:ss';
const MINUS_FLAG = '-';

interface IGetGridConfigParams {}
type GetGridConfigType = (params: IGetGridConfigParams) => IUseManualConsumeModelRes['gridConfig'];
export const getGridConfig: GetGridConfigType = (_params) => {
  return [
    {
      title: '变更内容',
      name: 'changeContent',
    },
    {
      title: '变更时间',
      bodyRender(data) {
        return format(data.eventTime, FORMAT_TIME_STRING);
      },
    },
    {
      title: '购买课时变更',
      name: 'operationValueInfo.mainAssetChangeAmount',
      formatter: addPrefixSymbol(MINUS_FLAG, { formatter: formatConsumeNum }),
    },
    {
      title: '赠送课时变更',
      name: 'operationValueInfo.rewardAssetChangeAmount',
      formatter: addPrefixSymbol(MINUS_FLAG, { formatter: formatConsumeNum }),
    },
    {
      title: '课时金额（元）',
      textAlign: 'right',
      name: 'operationValueInfo.mainAssetChangePrice',
      formatter: addPrefixSymbol(MINUS_FLAG, { formatter: formatMoney }),
    },
    {
      title: '备注',
      bodyRender(data) {
        return (
          <div className="ellipsis" title={data.remark}>
            {data.remark}
          </div>
        );
      },
    },
    {
      title: '操作人',
      textAlign: 'right',
      bodyRender(data) {
        return (
          <div className="course-summary__duoLine-cell">
            <p className="ellipsis" title={data.operator.nickName}>
              {data.operator.nickName}
            </p>
            <p>{data.operator.mobile}</p>
          </div>
        );
      },
    },
  ];
};

function formatConsumeNum(consumeAmount: string | number) {
  const consumeNum = Number(consumeAmount) / 100;
  return consumeNum.toFixed(2);
}

interface IAddPrefixContent {
  formatter?(value: any): any;
}
function defaultFormatter(data: any) {
  return data;
}
function addPrefixSymbol(preSymbol: string, content: IAddPrefixContent) {
  const { formatter = defaultFormatter } = content;
  return (data: any) => `${data === 0 ? '' : preSymbol} ${formatter(data)}`;
}
