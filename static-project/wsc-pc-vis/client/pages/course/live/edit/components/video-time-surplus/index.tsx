import { Pop } from '@zent/compat';
import React, { useEffect, useState } from 'react';
import { Button, Icon, IPopProps } from 'zent';
import classnames from 'classnames';
import { BRANCH_STORE_NAME } from 'constants/chain';
import { isBranchStore, isHqStore } from '@youzan/utils-shop';
import SwitchRender from '../../../../components/switch-render';
import { getVideoTimeSurplusData } from '../../../common';
import * as Api from '../../../api';

import style from './style.m.scss';

interface IProps {
  liveType: number;
}

interface IState {
  /** 剩余时长 */
  surplusTime: number;
  /** 1: 正常 , 2: 补贴 */
  status: 1 | 2;
}

const getRechargeTips = (): string | undefined => {
  if (isBranchStore) {
    return `暂不支持${BRANCH_STORE_NAME}充值，请联系总部处理`;
  }

  if (isHqStore) {
    return '暂不支持总部充值';
  }
};

const VideoTimeSurplus: React.FC<IProps> = (props) => {
  const { liveType } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [state, setState] = useState<IState>({
    surplusTime: 0,
    status: 1,
  });

  useEffect(() => {
    setLoading(true);
    Api.getLiveVideoSurplus({
      liveType,
    })
      .then((data) => {
        setState((state) => ({
          ...state,
          surplusTime: data.surplusTime,
          status: data.status,
        }));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [liveType]);

  const data = getVideoTimeSurplusData(state);
  const allowRecharge = !isBranchStore && !isHqStore && data.rechargeUrl;

  return (
    <div className={style.surplus}>
      <div className="surplus-title">
        <div>剩余观看时长(分钟)</div>
        <Pop content={data.tips} trigger="hover" position="bottom-left">
          <Icon className="surplus-icon" type="help-circle" />
        </Pop>
      </div>
      {!loading && (
        <div className="surplus-content">
          <SwitchRender<IPopProps>
            value={(isHqStore || isBranchStore) && Boolean(data.rechargeUrl)}
            component={Pop}
            componentProps={{
              content: getRechargeTips(),
              trigger: 'hover',
              position: 'bottom-left',
            }}
          >
            <span
              className={classnames({
                'surplus-num': true,
                'text--bold': !allowRecharge,
              })}
            >
              {data.value}
            </span>
          </SwitchRender>

          {allowRecharge && (
            <Button
              className="surplus-button"
              type="primary"
              href={data.rechargeUrl}
              target="_blank"
            >
              前往充值
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoTimeSurplus;
