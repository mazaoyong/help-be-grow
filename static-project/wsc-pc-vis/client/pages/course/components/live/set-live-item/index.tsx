// 信息设置
import React, { FC, useEffect, useState, useCallback } from 'react';
import { Radio, Button, Notify } from 'zent';
import get from 'lodash/get';

import {
  getVisibilityConfigForLive,
  createSingleVisibilityConfig,
  putSingleVisibilityConfig,
} from '../../../api/pct/hideinfo';

import './style.scss';

const { Group: RadioGroup } = Radio;
const operatorMobile = window._global.mobile;

interface IProps {
  alias: string;
  close: any;
}

interface ICreateReqDTOItem {
  itemType: number;
  kdtId: number;
  alias: string;
  operatorMobile: string;
  field: string;
  showType: number;
  partShowType?: number;
}

interface IPutReqDTOItem {
  operatorMobile: string;
  showType: number;
  partShowType?: number;
  visibilityId: number;
}

const SetLiveItem: FC<IProps> = (props: IProps) => {
  const { alias, close } = props;
  const [liveNum, setLiveNum] = useState('all');
  const [subsNum, setSubsNum] = useState('all');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getVisibilityConfigForLive({
      alias,
    })
      .then(data => {
        if (data && data.length) {
          data.forEach(item => {
            const { field, showType, partShowType } = item;
            if (field === 'on_line_num' && showType === 3 && partShowType === 1) {
              setLiveNum('none');
            } else if (field === 'sales' && showType === 2) {
              setSubsNum('none');
            }
          });
        }
      })
      .catch(msg => {
        Notify.error(msg);
      });
  }, [alias]);

  const save = useCallback(() => {
    const publicFields = {
      itemType: 4,
      kdtId: _global.kdtId,
      alias,
      operatorMobile,
    };
    const onlineFields = liveNum === 'all'
      ? { showType: 1 }
      : { showType: 3, partShowType: 1 };
    let saleFields = subsNum === 'all'
      ? { showType: 1 }
      : { showType: 2 };

    setSubmitting(true);
    getVisibilityConfigForLive({
      alias,
    })
      .then(data => {
        if (!data) return;
        if (!data.length) {
          const createList: ICreateReqDTOItem[] = [
            {
              field: 'on_line_num',
              ...publicFields,
              ...onlineFields,
            },
            {
              field: 'sales',
              ...publicFields,
              ...saleFields,
            },
          ];
          return createSingleVisibilityConfig({
            singleVisibilityCreateReqDTOList: createList,
          });
        } else {
          const { onlineId, salesId } = getVisibilityId(data);
          const putList: IPutReqDTOItem[] = [
            {
              visibilityId: onlineId,
              ...onlineFields,
              operatorMobile,
            },
            {
              visibilityId: salesId,
              ...saleFields,
              operatorMobile,
            },
          ];
          return putSingleVisibilityConfig({
            singleVisibilityPutReqDTOList: putList,
          });
        }
      })
      .then(data => {
        if (data) {
          Notify.success('保存成功');
          close();
        } else {
          Notify.error('保存失败');
        }
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        setSubmitting(false);
      });
  }, [alias, close, liveNum, subsNum]);

  // 取直播对应的属性的visibilityId
  function getVisibilityId(arr) {
    const obj = {
      onlineId: 0,
      salesId: 0,
    };
    arr.forEach(item => {
      const { field } = item;
      if (field === 'on_line_num') {
        obj.onlineId = get(item, 'id');
      } else if (field === 'sales') {
        obj.salesId = get(item, 'id');
      }
    });
    return obj;
  };

  function liveNumChange(e) {
    setLiveNum(e.target.value);
  };

  return (
    <div>
      <ul className="hide-list clearfix">
        <li className="hide-list__item clearfix">
          <div className="hide-list__item__title">直播人数：</div>
          <RadioGroup
            className="hide-list__item__radio"
            onChange={liveNumChange}
            value={liveNum}
          >
            <Radio value="all">所有人可见</Radio>
            <Radio value="none">仅讲师可见</Radio>
          </RadioGroup>
        </li>
      </ul>
      <div className="hide-btns">
        <Button onClick={close}>取消</Button>
        <Button type="primary" onClick={save} loading={submitting}>保存</Button>
      </div>
    </div>
  );
};

export default SetLiveItem;
