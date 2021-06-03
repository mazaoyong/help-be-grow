import React, { ReactElement } from 'react';
import { Icon } from 'zent';
import { DEFAULT_AVATAR } from '../../constants';
import { Img } from '@youzan/ebiz-components';
import { isInStoreCondition } from 'fns/chain';
import { ITeacherInfo } from '../interface';
import { Link as SamLink } from '@youzan/sam-components';
import './index.scss';

const { ImgWrap } = Img;
const NewIcon = Icon as any;

export default function TeacherInfoPanel(props: Partial<ITeacherInfo>): ReactElement {
  const { icon, teacherName, mobile, duty, description, staffName, shopName, resource = {} } = props;
  return <div className="teacher-info-panel">
    <div className="teacher-avatar-panel">
      <SamLink name='编辑' className="tearcher-info-edit-btn" onClick={() => { window.open(isInStoreCondition({ supportEduChainStore: true }) ? `https://www.youzan.com/v4/setting/chainstaff#/staff/edit/${resource ? resource.bizId : ''}` : `https://www.youzan.com/v4/setting/staff#/edit/${resource ? `${resource.bizId}/TEACHER` : ''}`); }}>
        <NewIcon type="edit-o" />
        <span>编辑</span>
      </SamLink>
      <div className="teacher-avatar">
        <ImgWrap width="70px" height="70px" src={icon || DEFAULT_AVATAR} />
      </div>
      <p className="teacher-staffname">{staffName}</p>
      <div className="teacher-mobile">{formatMobile(mobile || '')}</div>
    </div>
    <div className="teacher-split-line" />
    <div className="teacher-description-panel">
      <div className="teacher-item-wrap">
        <span className="teacher-label">老师昵称</span>
        <span className='teacher-content'>{teacherName || '-'}</span>
      </div>
      <div className="teacher-item-wrap">
        <span className="teacher-label">职位描述</span>
        <span className='teacher-content'>{duty || '-'}</span>
      </div>
      <div className="teacher-item-wrap">
        <span className="teacher-label">老师简介</span>
        <div className='teacher-content'>{description || '-'}</div>
      </div>
      { isInStoreCondition({ supportEduHqStore: true, supportEduBranchStore: true }) &&
        <div className="teacher-item-wrap">
          <span className="teacher-label">所属校区</span>
          <span>{shopName || '总部'}</span>
        </div>
      }
    </div>
  </div>;
}

function formatMobile(mobile: string) : string {
  if (!mobile || mobile.length !== 11) {
    return mobile;
  }
  let mobileArray = mobile.split('');
  mobileArray.splice(3, 0, '-');
  mobileArray.splice(8, 0, '-');
  return mobileArray.join('');
}
