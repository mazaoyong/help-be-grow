import { Pop } from '@zent/compat';
import * as React from 'react';
import { IEduAssetOperationBriefDTO } from 'definitions/api/owl/pc/EduAssetOperationFacade/queryAssetOperationBriefInfo';
import { IBlockHeaderProps, IHeaderState, IBlockHeaderInfoProps } from '../../types';
import { queryAssetOperationBriefInfo } from '../../api';
import { OpenAvailableDialog as OpenEditAvailableTime, OpenCourseDialog as OpenEditCourseTime, EduClassChangeDialog } from '@ability-center/assets';
import VersionWrapper from 'fns/version';
import { Link as SamLink } from '@youzan/sam-components';
import { VALIDITY_TYPE } from '../../constants';
import { get } from 'lodash';

import './style.scss';

const { open: openEduClassChange } = EduClassChangeDialog;

const useGetInfo = (studentId, assetNo, kdtId, handleBlockShowStatus) => {
  const [info, setInfo] = React.useState<IHeaderState>({});

  React.useEffect(() => {
    queryAssetOperationBriefInfo<IEduAssetOperationBriefDTO>({
      studentId,
      assetNo,
      kdtId
    })
      .then(data => {
        setInfo(data);
        handleBlockShowStatus({
          hasAssetValue: data.hasAssetValue,
          hasAssetValidity: data.hasAssetValidity,
          hasAssetClass: data.hasAssetClass && data.courseSellType === 3,
        });
      });
  }, [assetNo, studentId, kdtId]);

  return [info];
};

const Course: React.FC<IBlockHeaderInfoProps> = (props) => {
  const openEdit = () => {
    if ('kdtId' in props.info) {
      const { kdtId, assetNo, studentId } = props.info;
      OpenEditCourseTime({
        defaultData: {
          kdtId,
          assetNo,
          studentId,
        },
        callback: () => {
          location.reload();
        }
      });
    }
  };

  if ('kdtId' in props.info && props.info.hasAssetValue) {
    const { hasAssetValue, assetValue, changeAssetValue } = props.info;

    return !hasAssetValue ? null : (
      <div className="sum-grid-item">
        <div className="sum-grid-item-top">
          <span className="sum-grid-item-top__desc">课时</span>
          {
            changeAssetValue ? (
              VersionWrapper({
                name: 'student-detail-sigend-course-edit-course-time',
                children: (<SamLink
                  key="handleChangeCourseTime"
                  name="修改课时/有效期"
                  hide={true}
                  className="sum-grid-item-top__action"
                  onClick={openEdit}
                >
                  修改
                </SamLink>)
              })
            ) : null
          }
        </div>
        <div className="sum-grid-item-course">
          <span className="sum-grid-item-course__remain">{assetValue.assetRemaining / 100}</span>
          <span className="sum-grid-item-course__dot">/</span>
          <span className="sum-grid-item-course__total">共{assetValue.assetAmount / 100}</span>
          {
            assetValue.rewardAmount ? (
              <span className="sum-grid-item-course__total">（含赠送{assetValue.rewardAmount / 100}课时）</span>
            ) : null
          }
        </div>
      </div>
    );
  } else {
    return (null);
  }
};

const Available: React.FC<IBlockHeaderInfoProps> = (props) => {
  const openEdit = () => {
    if ('kdtId' in props.info) {
      const { kdtId, assetNo, studentId, assetValidity } = props.info;
      const defaultAvailableTime = [assetValidity.startTime, assetValidity.endTime].map(time => (Number(time) < 0 ? '' : time));
      OpenEditAvailableTime({
        defaultData: {
          kdtId: kdtId,
          assetNo: assetNo,
          studentId: studentId,
          time: defaultAvailableTime,
        },
        callback: () => {
          location.reload();
        }
      });
    }
  };

  if ('kdtId' in props.info && props.info.hasAssetValidity) {
    const { hasAssetValidity, assetValidity, changeAssetValidity } = props.info;
    const { validityDescription, validityType } = assetValidity;

    const editText = validityDescription === '未设置有效期' ? '设置有效期' : '修改';

    return !hasAssetValidity ? null : (
      <div className="sum-grid-item">
        <div className="sum-grid-item-top">
          <span className="sum-grid-item-top__desc">有效期</span>
          {
            changeAssetValidity ? (
              VersionWrapper({
                name: 'student-detail-sigend-course-edit-available-time',
                children: (
                  <SamLink
                    key="handleSetDefaultAvailableTime"
                    name="修改课时/有效期"
                    hide={true}
                    onClick={openEdit}
                    className="sum-grid-item-top__action"
                  >
                    {editText}
                  </SamLink>
                )
              })
            ) : null
          }
        </div>
        <div className="sum-grid-item-validity">
          <span className="sum-grid-item-validity__title">{`${validityDescription}`}</span>
          {
            validityType === VALIDITY_TYPE.SIGNIN_VALID ? (
              <span className="sum-grid-item-validity__tip">首次上课签到后生效</span>
            ) : null
          }
        </div>
      </div>
    );
  } else {
    return null;
  }
};

const Class: React.FC<IBlockHeaderInfoProps> = (props) => {
  const openClass = () => {
    if ('kdtId' in props.info) {
      const { kdtId, assetNo, studentId, assetClassList } = props.info;
      const eduClassId = get(assetClassList, '[0].eduClassId');

      openEduClassChange({
        defaultData: {
          kdtId: kdtId,
          assetNo,
          studentId,
          eduClassId: eduClassId,
        },
        className: 'student-dialog',
        callback: () => {
          location.reload();
        }
      });
    }
  };

  if ('kdtId' in props.info && props.info.hasAssetClass) {
    const { hasAssetClass, assetClassList = [], changeAssetClass } = props.info;
    const classNames = assetClassList.map(o => {
      return o.className;
    });
    const classNamesStr = classNames.join('、');

    return !hasAssetClass ? null : (
      <div className="sum-grid-item">
        <div className="sum-grid-item-top">
          <span className="sum-grid-item-top__desc">班级</span>
          {
            changeAssetClass ? (
              VersionWrapper({
                name: 'student-detail-sigend-course-shift-class',
                children: (<a
                  key="handleChangeStudentClass"
                  onClick={openClass}
                  className="sum-grid-item-top__action"
                >
                  调班
                </a>)
              })
            ) : null
          }
        </div>
        {
          classNames.length > 1 ? (
            <Pop trigger="hover" position="bottom-center" content={classNamesStr}>
              <div className="sum-grid-item-class">
                {classNamesStr}
              </div>
            </Pop>
          ) : (
            <div className="sum-grid-item-class">
              {classNamesStr || '-'}
            </div>
          )
        }
      </div>
    );
  } else {
    return null;
  }
};

const Header: React.FC<IBlockHeaderProps> = (props) => {
  const { studentId, assetNo, kdtId, handleBlockShowStatus } = props;
  const [info] = useGetInfo(studentId, assetNo, kdtId, handleBlockShowStatus);

  return ('kdtId' in info) ? (
    <div className="data-block">
      <div className="data-block-title">
        <span className="data-block-title__main">{info.courseTitle}</span>
        <span className="data-block-title__sub">关联课程：{info.eduCourseName}</span>
      </div>
      <div className="data-block-info">
        <div className="sum-grid">
          <Course info={info} />
          <Available info={info} />
          <Class info={info} />
        </div>
      </div>
    </div>
  ) : null;
};

export default Header;
