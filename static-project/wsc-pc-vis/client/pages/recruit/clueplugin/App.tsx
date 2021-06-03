import React, { useState, FC } from 'react';
import { Button, Notify } from 'zent';
import { initCluePlugin } from './api';
import './style.scss';

const InitButton: FC = () => {
  const [loading, setLoading] = useState(false);
  const defaultMsg = '出现了一些错误，请重试';
  const handleInitButtonClick = () => {
    setLoading(true);
    initCluePlugin({}).then(
      isSuccess => {
        if (!isSuccess) {
          Notify.error(defaultMsg);
          return;
        }
        location.href = '/v4/vis/edu/page/clue/all';
      }
    ).catch(msg => {
      Notify.error(msg || defaultMsg);
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <Button
      type="primary"
      onClick={handleInitButtonClick}
      loading={loading}
    >
      立即体验
    </Button>
  );
};

const IntroText: FC = () => (
  <div className="intro-text">
    <hgroup>
      <h1>线索管理</h1>
      <h2>标准化销售流程，让销售更高效</h2>
    </hgroup>
    <h2>功能介绍</h2>
    <p>涵盖销售线索获取、跟进、转化与留存等环节，实现对销售线索的精细化管理</p>
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
    <img src="https://img.yzcdn.cn/upload_files/2019/12/05/FsJZ-fZHJdEicxzg6b9UnaIBGTq1.png" alt="" />
  </section>
);

const App: FC = () => (
  <main className="clue-plugin">
    <Introduction />
    <HeroImage />
  </main>
);

export default <App />;
