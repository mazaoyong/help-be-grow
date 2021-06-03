import React, { FC, useCallback, useState, useRef, useEffect, useMemo } from 'react';
import { Affix, Tabs } from 'zent';
import { url } from '@youzan/utils';

import { NewStudentRewardDisplayValue } from '../new-student-reward-display-field';
import { NewStudentRewardValue } from '../new-student-reward-field';
import { IOldstudentPosterValue } from '../old-student-poster-field';

import { getNewStuRewardTip } from '../../utils';

import './index.scss';

const TabPanel = Tabs.TabPanel;
export interface IPreviewProps {
  posterStyle: number;
  oldStudentAwardName: string;
  oldStudentAwardLabel: string;
  time: string[];
  newStudentRewardDisplaySetting: NewStudentRewardDisplayValue;
  newStudentRewardSetting: NewStudentRewardValue;
  constitutionDesc: string;
  showJoinNum: number;
  oldStudentPoster: IOldstudentPosterValue;
}

const prefixcls = 'preview-wrapper';

const oldPreviewUrl = url.buildUrl(`/wscvis/ump/introduction/old-student-preview`, 'h5');
const newPreviewUrl = url.buildUrl(`/wscvis/ump/introduction/new-student-preview`, 'h5');
const targetOrigin = url.buildUrl(``, 'h5');

const Preview: FC<IPreviewProps> = props => {
  const [activeTab, setActiveTab] = useState('oldStudent');
  const changeTab = useCallback(active => {
    setActiveTab(active);
  }, []);
  return (
    <Affix offsetTop={16} placeholderClassName={prefixcls}>
      <img className={`${prefixcls}-top`} src='https://b.yzcdn.cn/public_files/62ef11ba4c552e87029b6883a9d1ec9d.png' />
      {activeTab === 'oldStudent' ? <TabContent {...props} from='old' /> : <TabContent {...props} from='new' />}
      <div className={`${prefixcls}-tab`}>
        <Tabs activeId={activeTab} onChange={changeTab} type="button">
          <TabPanel key="oldStudent" tab={<span>老学员活动页</span>} id="oldStudent"></TabPanel>
          <TabPanel key="newStudent" tab={<span>新学员活动页</span>} id="newStudent"></TabPanel>
        </Tabs>
      </div>
    </Affix>
  );
};

interface ITabContentProps extends IPreviewProps {
  from: 'new' | 'old';
}

const TabContent: FC<ITabContentProps> = (props) => {
  const iframeRef = useRef<HTMLIFrameElement>();
  const { newStudentRewardDisplaySetting, newStudentRewardSetting } = props;
  const newStudentRewardTip = useMemo(() => {
    return getNewStuRewardTip({ newStudentRewardDisplaySetting, newStudentRewardSetting });
  }, [newStudentRewardDisplaySetting, newStudentRewardSetting]);
  const postMsg = useCallback(() => {
    if (iframeRef.current?.contentWindow) {
      const data = {
        ...props,
        newStudentRewardTip
      };
      iframeRef.current.contentWindow.postMessage(data, targetOrigin);
    }
  }, [newStudentRewardTip, props]);
  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (event.data === 'introduction-preview') {
        postMsg();
      }
    });
    postMsg();
  }, [postMsg]);
  return (
    <div className={`${prefixcls}-main`}>
      <iframe src={props.from === 'old' ? oldPreviewUrl : newPreviewUrl} className={`${prefixcls}-main-iframe`} ref={(iframe) => { if (iframe) iframeRef.current = iframe; }} />
    </div>
  );
};

export default Preview;
