import React, { useEffect } from 'react';
import './style.scss';

import Section from '../section';
import sectionsConfig from '../config';
import YZLocalStorage from 'zan-utils/browser/local_storage';
import openIntroFeatureDialog from '../components/fans-poster-intro';

const kdtId = window._global.kdtId;
// 当has_shown_fans_poster_intro_${kdtId}为false时，显示引导弹框
const hasShownFansPosterIntro = YZLocalStorage.getItem(`has_shown_fans_poster_intro_in_pct_${kdtId}`);

export default () => {
  useEffect(() => {
    setTimeout(() => {
      if (!hasShownFansPosterIntro) {
        openIntroFeatureDialog();
      }
    }, 1000);
  });

  return (
    <div className="ump-wrap">
      {sectionsConfig.map((value, index) => {
        return <Section key={index} data={value} />;
      })}
    </div>
  );
};
