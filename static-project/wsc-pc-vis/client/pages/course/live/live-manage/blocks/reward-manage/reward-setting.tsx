import { Pop } from '@zent/compat';
import React, { FC, useCallback, useState, useEffect } from 'react';
import { hot } from 'react-hot-loader';
import { Icon, Notify } from 'zent';
import { liveRewardSetting, getLiveRewardSetting, queryRewardBriefInfo, IQueryRewardBriefInfo } from '../../../api/live-manage';

interface IRewardSettingProps {
  alias: string;
}

const RewardSetting: FC<IRewardSettingProps> = (props) => {
  const { alias } = props;
  const [switchLabelInfo, setSwitchLabelInfo] = useState({
    switchLabel: '已启用',
    switchActionName: '停用'
  });
  const [openReward, setOpenReward] = useState(1);
  const [briefInfo, setBriefInfo] = useState<IQueryRewardBriefInfo>({
    averagePayAmount: 0,
    totalPayNum: 0,
    totalPayUser: 0,
    totalPayAmount: 0,
  });

  // 获取打赏开关配置
  const fetchLiveSetting = useCallback(() => {
    return getLiveRewardSetting({ alias })
      .then((res = {}) => {
        const { openReward } = res;
        return openReward;
      }).catch(Notify.error);
  }, [alias]);

  // 获取打赏统计信息
  const fetchRewardBriefInfo = useCallback(() => {
    return queryRewardBriefInfo({
      alias
    })
      .then((res) => {
        return res;
        // res && setBriefInfo(res);
      }).catch(Notify.error);
  }, [alias]);

  // 设置打赏开关
  const setLiveSetting = useCallback(() => {
    const params = {
      openReward: openReward === 0 ? 1 : 0,
      alias,
    };
    liveRewardSetting(params)
      .then((res = {}) => {
        const { openReward } = res;
        setOpenReward(openReward);
        setSwitchLabelInfo({
          switchLabel: openReward === 0 ? '已停用' : '已启用',
          switchActionName: openReward === 0 ? '启用' : '停用'
        });
      }).catch(Notify.error);
  }, [alias, openReward]);

  useEffect(() => {
    Promise.all([
      fetchLiveSetting(),
      fetchRewardBriefInfo(),
    ])
      .then(([openReward, briefData]) => {
        setOpenReward(openReward);
        setSwitchLabelInfo({
          switchLabel: openReward === 0 ? '已停用' : '已启用',
          switchActionName: openReward === 0 ? '启用' : '停用'
        });
        setBriefInfo(briefData as IQueryRewardBriefInfo);
      });
  }, [fetchLiveSetting, fetchRewardBriefInfo]);

  return (
    <section className="reward-setting">
      <div className="reward-setting__title">
        <h1>打赏管理</h1>
        <div className="switch">
          <span className="switch-label">{switchLabelInfo.switchLabel}</span>
          <a
            className="switch-action"
            onClick={setLiveSetting}
          >{switchLabelInfo.switchActionName}</a>
        </div>
      </div>
      <div className="reward-setting__overview">
        <div className="item">
          <div className="item-top">
            <span>课程累计打赏金额(元)</span>
            <Pop trigger="hover" content="课程累计打赏金额">
              <Icon type="help-circle" className="item-top-icon" />
            </Pop>
          </div>
          <p className="item-bottom">{briefInfo.totalPayAmount / 100}</p>
        </div>
        <div className="item">
          <p className="item-top">
            <span>课程累积打赏次数</span>
          </p>
          <p className="item-bottom">{briefInfo.totalPayNum}</p>
        </div>
        <div className="item">
          <p className="item-top">
            <span>打赏人数</span>
          </p>
          <p className="item-bottom">{briefInfo.totalPayUser}</p>
        </div>
        <div className="item">
          <p className="item-top">
            <span>人均打赏金额(元)</span>
          </p>
          <p className="item-bottom">{briefInfo.averagePayAmount / 100}</p>
        </div>
      </div>
    </section>
  );
};

export default hot(module)(RewardSetting);
