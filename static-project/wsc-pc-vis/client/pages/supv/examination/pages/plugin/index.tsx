import { get } from 'lodash';
import React, { useState, FC } from 'react';
import { Button, Notify } from 'zent';
import './style.scss';
import { initExamPlugin } from './api';
import { APPID } from '../../constants';

const InitButton: FC = () => {
  const [loading, setLoading] = useState(false);
  const handleInitButtonClick = () => {
    // 如果插件不可使用，跳转到订购页
    if (!get(_global, 'pluginInfo.canBeUsed', false)) {
      location.href = `/v4/subscribe/appmarket/appdesc/board?id=${APPID}`;
    } else {
      // 如果可被使用，那么就是未初始化过插件
      setLoading(true);
      const defaultErrorMsg = '出现了一些错误，请重试';
      initExamPlugin({}).then(
        isSuccess => {
          if (!isSuccess) {
            Notify.error(defaultErrorMsg);
            return;
          }
          location.href = '/v4/vis/supv/examination';
        }
      ).catch(msg => {
        Notify.error(msg || defaultErrorMsg);
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  return (
    <Button
      type="primary"
      onClick={handleInitButtonClick}
      loading={loading}
    >
      立即使用
    </Button>
  );
};

const IntroText: FC = () => (
  <div className="intro-text">
    <hgroup>
      <h1>考试</h1>
      <h2>在线测评，检测学员学习效果。</h2>
    </hgroup>
    <h1>适用场景</h1>
    <p>
      <span className="label">学前测评：</span>
      <span className="desc">新学员能力摸底测评，机构根据学员真实水平推荐课程，提升转化率。</span>
    </p>
    <p>
      <span className="label">课后考试：</span>
      <span className="desc">购买课程可参与考试，学习效果真实可见，学员学习更有目标</span>
    </p>
  </div>
);

const Introduction: FC = () => (
  <section className="introduction">
    <IntroText />
    <InitButton />
  </section>
);

const HeroImage: FC = () => (
  <section className="hero-image">
    <img src="https://img.yzcdn.cn/public_files/c8bec6afc531db720aa48b2b015b121e.png" alt="" />
  </section>
);

const App: FC = () => (
  <main className="plugin">
    <Introduction />
    <HeroImage />
  </main>
);

export default <App />;
