import React, { FC } from 'react';
import PosterTemplateItem, { IPosterTemplateItem } from './PosterTemplateItem';

const TEMPLATE_LIST: IPosterTemplateItem[] = [
  {
    thumbUrl:
      'https://img.yzcdn.cn/upload_files/2020/10/23/Fim_lFCGGDQlAP9y5x8LA9wrM-6y.jpg',
    title: '在线课堂、直播公开课',
  },
  {
    thumbUrl:
      'https://img.yzcdn.cn/upload_files/2020/10/23/FuqMwSIuK-bqhid4m8CLEp8vRyjd.jpg',
    title: '活动海报类营销',
  },
  {
    thumbUrl:
      'https://img.yzcdn.cn/upload_files/2020/10/23/Fl-TMo8KyCHhYSBDsMHRcRF-0z1W.jpg',
    title: '节日主题类营销',
  },
  {
    thumbUrl:
      'https://img.yzcdn.cn/upload_files/2020/10/23/Fo67A0Zxkvpewd2HgUGOib4QyImI.jpg',
    title: '大促活动类营销',
  },
  {
    thumbUrl:
      'https://img.yzcdn.cn/upload_files/2020/10/23/FpQl13u3vSILw-HB5xohfeO6eG31.jpg',
    title: '训练营、集训营类主题',
  },
];

const PosterTemplateList: FC = () => {
  return (
    <>
      {TEMPLATE_LIST.map((item) => (
        <PosterTemplateItem key={item.title} thumbUrl={item.thumbUrl} title={item.title} />
      ))}
    </>
  );
};

export default PosterTemplateList;
