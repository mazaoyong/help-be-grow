import React from 'react';
import cx from 'classnames';
import { Alert } from 'zent';
import style from './index.m.scss';

const methods = [
  <span key="1">前往 <a href="https://yingyong.youzan.com/cloud-app-detail/47423/info" target="_blank" rel="noopener noreferrer">有赞应用市场-保利威云直播</a>，用您的有赞账号开通。（推荐）</span>,
  <span key="2">前往 <a href="https://www.polyv.net" target="_blank" rel="noopener noreferrer">保利威云直播官网</a> 注册账号</span>,
];

const warning = [
  '在有赞创建保利威云直播商品，会在您的保利威账号下创建一个对应的直播频道，请勿随意删除频道，这将导致消费者无法观看直播。',
  '请勿在保利威管理后台，修改直播频道的观看条件，这可能导致消费者在购买后，无法正常访问直播间。',
  '完成授权后，请勿更改应用密钥，这将导致您在有赞的校区无法正常使用保利威云直播的服务。',
];

export default function InitTip() {
  return (
    <div className={style['init-tip']}>
      <p className={style.content}>使用保利威视频直播，需要您先注册保利威云直播账号：</p>
      <ul className={cx(style.content, style.methods)}>
        {methods.map((item, index) => (
          <li className={style['methods-item']} key={index}>
            <span className={style['methods-label']}>方法 {index + 1}.</span>
            {item}
          </li>
        ))}
      </ul>
      <p className={style.content}>注册完成后，请登录 <a href="https://live.polyv.net/#/channel" target="_blank" rel="noopener noreferrer">保利威管理后台</a>，前往开发设置-身份认证，查看相关信息，并授权给有赞进行对接</p>
      <Alert
        type="warning"
        title={<span className={style['warning-title']}>注意事项</span>}
        description={(
          <span className={style.warning}>
            {warning.map((item, index) => (
              <span className={style['warning-item']} key={index}>
                <span className={style['warning-label']}>{index + 1}.</span>
                {item}
              </span>
            ))}
          </span>
        )}
      />
    </div>
  );
}
