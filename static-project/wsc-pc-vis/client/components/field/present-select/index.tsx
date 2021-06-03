import React, { FC, useCallback, useMemo } from 'react';
import { IGridColumn, Notify } from 'zent';
import {
  PresentSelector as RCPresentSelector,
  BlankLink,
  GoodsSelectorV2,
  LinkButton,
} from '@youzan/react-components';
import buildUrl from '@youzan/utils/url/buildUrl';

import { getPresentList, IPresentListItem } from './api';

import './styles.scss';

const { SelectResult } = GoodsSelectorV2;

export function getSelectedPresentLength(data: any) {
  return (data || []).reduce((total, item) => total + Number(item.pieces || item.quantity || 1), 0);
}

interface IPresentSelectorProps {
  /** 已选赠品列表宽 */
  width?: number;
  triggerText?: string;
  disabled?: boolean;
  helpDesc?: string;
  value: IPresentListItem[];
  maxNumLimit?: number;
  /** 是否支持多选 */
  multiple?: boolean;
  /** 是否支持单品多件（指定该字段时所有赠品均可多选） */
  multiPieces?: boolean;
  /** 是否支持部分单品多件（若 fetchApi 返回的某件赠品的 multiPieces 为 true 则该赠品单独支持选择多件） */
  partialMultiPieces?: boolean;
  onChange: (data: IPresentListItem[]) => void;
}

const PresentSelector: FC<IPresentSelectorProps> = ({
  width,
  triggerText = '选择赠品',
  disabled,
  helpDesc,
  value,
  maxNumLimit,
  multiple,
  multiPieces,
  partialMultiPieces,
  onChange,
}) => {
  const presentListConfig = useMemo<IGridColumn<IPresentListItem>[]>(
    () => [
      {
        title: '赠品名称',
        width: '120px',
        name: 'title',
        bodyRender: (row) => {
          const { alias, title } = row;
          const url = buildUrl(
            `https://h5.youzan.com/wscgoods/detail/${alias}`,
            '',
            _global.kdtId,
          );
          return (
            <BlankLink href={url}>
              {title}
            </BlankLink>
          );
        },
      },
      {
        title: '剩余库存',
        width: '120px ',
        bodyRender: (row) => {
          return row.stock;
        },
      },
      {
        title: '数量',
        width: '80px ',
        bodyRender: (row) => {
          return row.pieces;
        },
      },
      {
        title: '操作',
        textAlign: 'right',
        bodyRender: ({ id }) => {
          if (disabled) {
            return '-';
          }
          const handleChange = () => {
            const _value = value.filter((item) => item.id !== id);
            onChange(_value);
          };
          return <a onClick={handleChange}>删除</a>;
        },
      },
    ],
    [disabled, onChange, value],
  );

  const fetchPresentList = useCallback(({ keyword, pageNo, pageSize }) => {
    return new Promise((resolve, reject) =>
      getPresentList({
        command: {
          channel: 0,
          keyword,
        },
        pageRequest: {
          pageNumber: pageNo,
          pageSize,
        },
      })
        .then(({ content, total }) => {
          resolve({
            items: content.map(
              ({ isOwlGoods, isAvailable, unAvailableReason, stock, ...restItem }) => {
                return {
                  ...restItem,
                  isAvailable,
                  unAvailableReason,
                  channel: 1,
                  stock: isOwlGoods ? '不限库存' : stock,
                };
              },
            ),
            paginator: {
              totalCount: total,
            },
          });
        })
        .catch(reject),
    );
  }, []);

  const handleAdd = useCallback(() => {
    if (disabled) return;
    let amountMap = {};
    if (multiPieces) {
      value.forEach((v) => {
        amountMap[v.id] = v.pieces;
      });
    }
    RCPresentSelector.open({
      datasets: value,
      fetchApi: fetchPresentList,
      multiple,
      btnLink: '/v4/ump/present',
      multiPieces,
      amountMap,
      partialMultiPieces,
      onChange: (data: any[]) => {
        if (maxNumLimit && getSelectedPresentLength(data) > maxNumLimit) {
          Notify.error(`最多选择${maxNumLimit}个赠品`);
          return;
        }
        onChange(
          data.map((item) => ({
            ...item,
            pieces: Number(item.pieces || 1),
          })),
        );
      },
    });
  }, [
    disabled,
    multiPieces,
    value,
    fetchPresentList,
    multiple,
    partialMultiPieces,
    maxNumLimit,
    onChange,
  ]);

  return (
    <div className="present-selector">
      <div className="present-selector__trigger">
        <LinkButton onClick={handleAdd} disabled={!!disabled}>
          {triggerText}
        </LinkButton>
      </div>
      <div className="description">{helpDesc}</div>
      <div className="present-selector-grid">
        <SelectResult
          rowKey="id"
          width={width}
          columns={presentListConfig}
          datasets={value}
          isShow={value.length > 0}
        />
      </div>
    </div>
  );
};

export default PresentSelector;
