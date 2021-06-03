import React, { FC, useState, useEffect, useMemo, useCallback } from 'react';
import { BlockLoading, Notify } from 'zent';

import { getStudentInfoByNo, ApplicableSceneEnums } from '@ability-center/student';

import getStudentBaseInfo from './utils/get-student-baseinfo';
import formatAttributeItem from './utils/format-attribute-item';
import Divider from './components/divider';
import Header from './components/header';
import Content from './components/content';

import { IStudentCardProps, IStudentBaseInfo, formatFunc } from './types';
import './style.scss';
import { get, findIndex } from 'lodash';

const StudentCard: FC<IStudentCardProps> = props => {
  const {
    clueId,
    format,
    studentNo,
    studentId,
    decorateData,
    prefixContent,
    showCollapse = true,
    fetchOnMounted = true,
    displayLimitation = 5,
    onStudentInfoChange,
    updatingSignal = 0,
    applicableScene = ApplicableSceneEnums.ALL_SCENES,
    triggerCollapse,
  } = props;
  const [loading, setLoading] = useState(true);
  const [rawData, setRowData] = useState<Record<string, any>>({});
  const [studentInfo, setStudentInfo] = useState<Record<string, any>[]>([]);

  const dataRender = useCallback<formatFunc>(rowData => {
    if (format) {
      return format(rowData);
    }
    const label = get(rowData, 'attributeTitle', '');
    const content = formatAttributeItem(rowData);
    return { label, content };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchConfigsAndValues = useCallback(() => {
    getStudentInfoByNo({
      identityNo: String(studentNo || ''),
      studentId: Number(studentId || ''),
      clueId: Number(clueId || ''),
    })
      .then(rawData => {
        const { attributeItems } = rawData;
        setRowData(rawData);
        setStudentInfo(studentInfoFilter(attributeItems, applicableScene));
        onStudentInfoChange && onStudentInfoChange(rawData);
      })
      .catch(err => {
        console.error(err);
        Notify.error(err);
      })
      .finally(() => setLoading(false));
  }, [applicableScene, clueId, onStudentInfoChange, studentId, studentNo]);

  useEffect(() => {
    fetchOnMounted && fetchConfigsAndValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchOnMounted]);

  // 根据信号量重新请求数据
  useEffect(() => {
    if (updatingSignal) {
      setLoading(true);
      fetchConfigsAndValues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatingSignal]);

  const [studentInfoExcludeHeadInfo, studentBaseInfo]: [
    Record<string, any>[],
    IStudentBaseInfo | null,
  ] = useMemo(() => {
    if (studentInfo.length) {
      return getStudentBaseInfo(studentInfo);
    }
    return [[], null];
  }, [studentInfo]);

  const formattedData: ReturnType<formatFunc>[] | null = useMemo(() => {
    if (studentInfoExcludeHeadInfo.length) {
      const extendsStudentInfo = (prefixContent || []).concat(studentInfoExcludeHeadInfo);
      const sourceInfo = decorateData ? decorateData(extendsStudentInfo) : extendsStudentInfo;
      return sourceInfo.map(dataRender);
    }
    return null;
  }, [dataRender, decorateData, prefixContent, studentInfoExcludeHeadInfo]);

  return (
    <BlockLoading loading={loading} className="student-card">
      {studentBaseInfo && <Header {...studentBaseInfo} />}
      {formattedData && (
        <Divider>
          <Content
            contentData={formattedData}
            showCollapse={showCollapse}
            displayLimitation={displayLimitation}
            triggerCollapse={triggerCollapse}
          />
        </Divider>
      )}
      {props.children && props.children(rawData)}
    </BlockLoading>
  );
};

function studentInfoFilter(
  attributeItems: Record<string, any>[],
  applicableScene: ApplicableSceneEnums,
) {
  let filteredAttributes = attributeItems || [];
  if (Array.isArray(attributeItems) && attributeItems.length) {
    if (applicableScene !== ApplicableSceneEnums.ALL_SCENES) {
      filteredAttributes = attributeItems.filter(attribute => {
        const { applicableScenes } = attribute;
        // 学员场景需要显示未配置适用场景的资料项
        if (
          applicableScenes.length === 0 &&
          applicableScene === ApplicableSceneEnums.STUDENT_SCENE
        ) {
          return true;
        }
        const isCurrentScene = findIndex(applicableScenes, { applicableScene });
        return isCurrentScene >= 0;
      });
    }
  }
  return filteredAttributes;
}

export default StudentCard;
export { Divider };
