import React from 'react';
import { Dialog, Button } from 'zent';
import YZLocalStorage from 'zan-utils/browser/local_storage';
import { calcIntroDialogPosition, getFansPosterWidth } from './utils';
import Item from '../../item';
import './style.scss';

const { openDialog, closeDialog } = Dialog;
const id = 'intor-feature-dialog';
const kdtId = window._global.kdtId;

function closeIntroFeatureDialog() {
  closeDialog(id);
  YZLocalStorage.setItem(`has_shown_fans_poster_intro_in_pct_${kdtId}`, 1);
}

const fansPoster = {
  appId: 40835,
  bgColor: '#df4545',
  category: 'marketing',
  desc: '利用海报裂变帮助公众号吸粉',
  icon: '/upload_files/2020/04/30/Fpp1_paZEKJxOFnjgWh2KYOY9rZr.png',
  latest: true,
  name: '涨粉海报',
  srcset: '/upload_files/2020/04/30/Fpp1_paZEKJxOFnjgWh2KYOY9rZr.png',
  supportWeapp: false,
  url: '/v4/industry/fans-poster',
};

const footer = width => (
  <>
    <Button
      style={{ transform: 'translateY(-15px)' }}
      type="primary"
      onClick={closeIntroFeatureDialog}
    >
      我知道了
    </Button>
    <div className="fans-poster-intro-trangle"></div>
    <div style={{ width: `${width}px` }}>
      <Item data={fansPoster} />
    </div>
  </>
);

export default () => {
  setTimeout(() => {
    const [left, top] = calcIntroDialogPosition();
    const fansPosterWidth = getFansPosterWidth();
    requestAnimationFrame(() => {
      window.scrollTo(left - window.innerWidth / 2, top - window.innerHeight / 2);
      openDialog({
        dialogId: id,
        title: '',
        className: 'intro-feature-dialog',
        children: '公众号海报升级为涨粉海报，更多功能等你体验。',
        closeBtn: false,
        style: {
          width: '340px',
          height: '100px',
          left: left - document.documentElement.scrollLeft || '683px',
          top: top - 110 - document.documentElement.scrollTop || '90px',
          position: 'absolute',
          padding: 0,
        },
        footer: footer(fansPosterWidth),
      });
    });
  }, 1000);
};
