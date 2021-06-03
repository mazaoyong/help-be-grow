import { clone } from 'lodash';
import React from 'react';
import '../../assets/info-hidden.scss';

interface IRadioOpt {
  text: React.ReactNode;
  value: string;
}
interface ICourseSetting {
  title: string;
  key: string;
  value: any;
  disabled: boolean;
  radio: IRadioOpt[];
  helpDesc?: React.ReactNode;
  helpCloseDesc?: React.ReactNode;
}
interface IFilterOpts {
  forceAvailable?: boolean;
}
interface ITend2OrderProps {
  description: string;
  href: string;
}

const TendToOrder: React.FC<ITend2OrderProps> = (props) => (
  <span className="tend-to-order__container">
    <span className="tend-to-order__des">{props.description}</span>
    <span className="tend-to-order__link">
      <a target="__blank" href={props.href}>了解详情</a>
    </span>
  </span>
);
const ELIMINATE_KEYS = ['subscriptionCountShow', 'newPublishCountShow', 'pageViewCountShow'];
const TEND2ORDER_MAP: Record<string, React.ReactNode> = {
  subscriptionCountShow: (
    <TendToOrder
      description="设置线上课是否显示订购数量"
      href="https://www.youzan.com/v4/subscribe/appmarket/appdesc/board?id=40833"
    />
  ),
  newPublishCountShow: (
    <TendToOrder
      description="设置专栏/会员权益是否显示更新期数"
      href="https://www.youzan.com/v4/subscribe/appmarket/appdesc/board?id=40833"
    />
  ),
  pageViewCountShow: (
    <TendToOrder
      description="设置线上课详情页浏览量/音频/视频播放次数"
      href="https://www.youzan.com/v4/subscribe/appmarket/appdesc/board?id=40833"
    />
  ),
};
export type EliminateInfoHiddenType = (
  originSettings: ICourseSetting[],
  opts?: IFilterOpts,
) => ICourseSetting[];
/**
 * @description 用于过滤课程设置中的信息隐藏设置
 * @param originSettings 原始数据，object类型，value为数组形式的设置
 * @param opts 过滤器额外配置项
 */
function eliminateInfoHidden(
  originSettings: ICourseSetting[],
  opts?: IFilterOpts,
): ICourseSetting[] {
  if (opts && opts.forceAvailable) return originSettings;

  const _filterSettings: ICourseSetting[] = [];
  originSettings.forEach((setting) => {
    const _shallowCloneSetting: ICourseSetting = clone(setting);
    if (ELIMINATE_KEYS.includes(setting.key)) {
      _shallowCloneSetting.disabled = true;
      // 默认设置信息隐藏功能状态为「显示」
      _shallowCloneSetting.value = true;
      _shallowCloneSetting.helpDesc = TEND2ORDER_MAP[setting.key] || null;
    }
    _filterSettings.push(_shallowCloneSetting);
  });
  return _filterSettings;
}

export { eliminateInfoHidden };
