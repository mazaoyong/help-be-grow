import React, { ReactElement, ComponentType, useEffect, useState, useMemo } from 'react';
import { BreadcrumbNav } from '@youzan/react-components';
import { hashHistory } from 'react-router';
import TeacherInfoPanel from '../components/teacher-info';
import Courselist from '../components/course-list';
import Schedulelist from '../components/schedule-list';
import Recordlist from '../components/record-list';
import '../style/detail-page.scss';
import { TTeacherDetailParams, ITeacherInfo } from '../components/interface';
import { getById } from '../../api/teachers';
import { Notify } from 'zent';

const navHrefs: string[] = ['/detail/course', '/detail/schedule', '/detail/record'];

interface NavChild {
  activeNav: string;
  teacherNo: string;
  teacherId: string;
  [index: string]: any;
}

export default function TeacherDetailPage(props: object): ReactElement {
  const [teacherInfo, setTeacherInfo] = useState<Partial<ITeacherInfo>>({});

  const { pathname, query } = hashHistory.getCurrentLocation();
  const activeIndex: number = navHrefs.indexOf(pathname);
  // @ts-ignore
  const teacherNo: string = query.teacherNo;
  // @ts-ignore
  const targetKdtId: number | null = query.targetKdtId;
  // @ts-ignore
  const teacherId: string = query.teacherId;

  // const operateMobile: string = query.operateMobile;
  // memorized component
  const Comp = useMemo<ComponentType<TTeacherDetailParams>>(() => getListComp(activeIndex), [activeIndex]);

  useEffect(() => {
    getById({
      kdtId: targetKdtId || _global.kdtId,
      teacherId,
    }).then(resp => {
      if (resp) {
        setTeacherInfo(resp);
      }
    }).catch(err => {
      Notify.error(err);
    });
  }, []);

  return (
    <div className='teacher-detail-wrap'>
      <TeacherInfoPanel
        {...teacherInfo}
      />
      <div className='teacher-detail-list'>
        <NaviWrapper
          {...props}
          teacherNo={teacherNo}
          targetKdtId={targetKdtId}
          teacherId={teacherId}
          // operateName={operateName}
          // operateMobile={operateMobile}
          activeNav={activeIndex > -1 ? navHrefs[activeIndex] : navHrefs[0]}
        />
        <Comp
          teacherNo={teacherNo}
          targetKdtId={targetKdtId}
          teacherInfo={teacherInfo}
        />
      </div>
    </div>
  );
}

function getListComp(activeIndex: number): ComponentType<TTeacherDetailParams> {
  switch (activeIndex) {
    case 0:
      return Courselist;
    case 1:
      return Schedulelist;
    case 2:
      return Recordlist;
    default:
      return Courselist;
  }
}

function NaviWrapper(props: NavChild): ReactElement {
  const navs = [
    { id: navHrefs[0], name: '所授线下课', href: `#${navHrefs[0]}?teacherNo=${props.teacherNo || ''}${props.targetKdtId ? `&targetKdtId=${props.targetKdtId}` : ''}&teacherId=${props.teacherId || ''}` },
    { id: navHrefs[1], name: '课表', href: `#${navHrefs[1]}?teacherNo=${props.teacherNo || ''}${props.targetKdtId ? `&targetKdtId=${props.targetKdtId}` : ''}&teacherId=${props.teacherId || ''}` },
    { id: navHrefs[2], name: '上课记录', href: `#${navHrefs[2]}?teacherNo=${props.teacherNo || ''}${props.targetKdtId ? `&targetKdtId=${props.targetKdtId}` : ''}&teacherId=${props.teacherId || ''}` },
  ];
  return <BreadcrumbNav navs={navs} activeNav={props.activeNav} hasBottomBorder />;
}
