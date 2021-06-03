import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Notify } from 'zent';
import { Select } from '@youzan/ebiz-components';
import { IOption } from '@youzan/ebiz-components/es/types/select';
import { get, find } from 'lodash';

import { isInStoreCondition } from 'fns/chain';
import { StudentCard, getContractListByStudentId, OtherStudentInfo } from '@ability-center/student';
import {
  SourceInfo,
  ISourceInfo,
  CluePhase,
  ICluePhaseProps,
  ClueTag,
  IClueTagProps,
  getClueDetailUrl
} from '@ability-center/clue';

import {
  // eslint-disable-next-line camelcase
  getStudentNoAndCustomInfo_OLD,
  getRoleInfo,
  checkIsPotentialStudent
} from '../api/student-detail';
import { Divider } from './components/student-card';
import OperatorButtons from './components/operator-buttons';
import StudentCampusList from './components/student-campus-list';
import MemberList from './components/member-list';
import TabsContainer from './blocks';
import { IStudentDetailRouteParams, IContractInfoStruct, ITabsContainerProps, ActionEnums } from './types';
import './style.scss';

type AddonCustomParamsType = { userId: number; name: string } & Record<string, any>;
const getAddonAttributes = (studentNo: string, customer: AddonCustomParamsType) => [
  {
    attributeTitle: '学员编号',
    value: studentNo
  },
  {
    attributeTitle: '关联客户',
    value: (
      <a
        href={`/v4/scrm/customer/manage#/detail?yzUid=${customer.userId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {customer.name || '-'}
      </a>
    )
  }
];

// 初始化更新信号量，为0避免初次就触发更新
type IUpdateSignalType = Record<keyof ITabsContainerProps['updatingSignal'], number>;
const INIT_UPDATING_SIGNAL: IUpdateSignalType = {
  studentCard: 0,
  signedCourse: 0,
  trailCourse: 0,
  classSchedule: 0,
  studyRecords: 0,
  commentRecords: 0,
  clueModifyRecords: 0
};
const INIT_DETAIL_PARAMS = { studentNo: '', source: '' };

const StudentDetail: React.FC<RouteComponentProps<
IStudentDetailRouteParams,
IStudentDetailRouteParams
>> = props => {
  const { params, location, router } = props;
  // 学员信息
  const { studentNo: defaultStudentNo, source } =
    (location.query as typeof INIT_DETAIL_PARAMS) || INIT_DETAIL_PARAMS;
  const { studentId } = params;
  const [studentNo, setStudentNo] = React.useState(defaultStudentNo);
  const [studentInfo, setStudentInfo] = React.useState({});
  // 校区信息
  const [campusList, setCampusList] = React.useState([]);
  // 客户信息
  const [customerInfo, setCustomerInfo] = React.useState<Record<string, any>>({});
  // 家庭信息
  const [contractInfo, setContractInfo] = React.useState<IContractInfoStruct>([]);
  // 阶段信息
  const [followInfo, setFollowInfo] = React.useState<Record<string, any>>();
  const [sourceInfo, setSourceInfo] = React.useState<ISourceInfo>();
  const [roleInfo, setRoleInfo] = React.useState<Record<string, any>>();
  const [phaseData, setPhaseData] = React.useState<ICluePhaseProps>();
  // 标签信息
  const [tagsInfo, setTagsInfo] = React.useState<IClueTagProps['tags']>([]);
  // 选区的校区信息
  const [selectedCampusKdtId, setCampusKdtId] = React.useState<any>();
  // 更新信号量
  const [updatingSignal, setUpdatingSignal] = React.useState(INIT_UPDATING_SIGNAL);

  const updateSignalByMerge = React.useCallback(
    (updateKeys: (keyof IUpdateSignalType)[]) => {
      const currentState: Partial<IUpdateSignalType> = {};
      updateKeys.forEach(key => {
        currentState[key] = updatingSignal[key] + 1;
      });
      setUpdatingSignal(Object.assign({}, updatingSignal, currentState));
    },
    [updatingSignal]
  );

  const handleStudentInfo = React.useCallback((rawData: Record<string, any>) => {
    const followInfo = get(rawData, 'followInfo');
    const resSourceInfo = get(followInfo, 'source');
    const resTagsInfo = get(rawData, 'tags', []);
    setSourceInfo(resSourceInfo);
    setFollowInfo(followInfo);
    setTagsInfo(resTagsInfo);
  }, []);

  // 获取家庭联系人列表
  const fetchContractList = React.useCallback(() => {
    getContractListByStudentId({ studentId })
      .then(res => {
        if (res) {
          const members = get<IContractInfoStruct>(res, 'members', []);
          const owner = get<Record<string, any>>(res, 'owner', {});
          setContractInfo([owner].concat(members));
        }
      })
      .catch(Notify.error);
  }, [studentId]);

  // 获取学员no和客户信息
  const fetchCampusAndCustom = React.useCallback(() => {
    getStudentNoAndCustomInfo_OLD({ studentId })
      .then(res => {
        const studentCampus = get(res, 'student.campuses', []);
        const studentInfo = get(res, 'student', {});
        const customInfo = get(res, 'customer', {});
        setCustomerInfo(customInfo);
        setCampusList(studentCampus);
        setStudentInfo(studentInfo);
        if (!studentNo) {
          setStudentNo(get(studentInfo, 'studentNo', ''));
        }
        if (studentCampus.length) {
          const targetCampus = find(studentCampus, { kdtId: _global.kdtId });
          const targetCampusKdtId = get(targetCampus, 'kdtId') || get(studentCampus, '[0].kdtId');
          setCampusKdtId([targetCampusKdtId]);
        }
      })
      .catch(Notify.error);
  }, [studentId, studentNo]);

  // 获取用户角色信息
  const fetchRoleInfo = React.useCallback(() => {
    getRoleInfo()
      .then(setRoleInfo)
      .catch(Notify.error);
  }, []);

  // 处理按钮操作回调
  const handleActionCallBack = React.useCallback(
    (action: ActionEnums) => {
      switch (action) {
        case ActionEnums.DELETE:
          router.push('/');
          break;
        case ActionEnums.COMMENT:
          updateSignalByMerge(['commentRecords', 'clueModifyRecords']);
          break;
        case ActionEnums.MODIFY:
          // 更新学员卡片和线索记录
          updateSignalByMerge(['studentCard', 'clueModifyRecords']);
          break;
        case ActionEnums.TRANSFORM:
        case ActionEnums.MODIFY_SOURCE:
          updateSignalByMerge(['studentCard', 'clueModifyRecords']);
          break;
        case ActionEnums.CLUE_PHASE:
        case ActionEnums.CLUE_TAGS:
          // 线索阶段改变和线索标签改动需要更新学员信息卡片来更新标签信息
          // 获取学员信息的接口内置在学员卡片内，要更新标签和阶段，需要触发卡片更新
          updateSignalByMerge(['studentCard', 'clueModifyRecords']);
          break;
        case ActionEnums.MODIFY_CLUE_RECORDS:
          updateSignalByMerge(['studentCard']);
          break;
        default:
          break;
      }
    },
    [router, updateSignalByMerge]
  );

  const handleCluePhaseChange = React.useCallback(() => handleActionCallBack(ActionEnums.CLUE_PHASE), [
    handleActionCallBack
  ]);
  const handleClueTagsChange = React.useCallback(() => handleActionCallBack(ActionEnums.CLUE_TAGS), [
    handleActionCallBack
  ]);

  // 初始化页面数据
  React.useEffect(() => {
    new Promise((resolve, reject) => (source === 'ability-center' ? reject() : resolve(void 0)))
      .then(() => checkIsPotentialStudent({ studentId }))
      .then(res => {
        if (res && res.potentialStudent) {
          // 如果是潜在学员
          const clueId = res.clueId;
          const clueDetailUrl = getClueDetailUrl('pool', clueId);
          window.location.href = clueDetailUrl;
        } else {
          updateSignalByMerge(['studentCard']);
        }
      })
      .finally(() => {
        fetchContractList();
        fetchCampusAndCustom();
        fetchRoleInfo();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 根据角色信息和学员详情拼装线索阶段细信息
  React.useEffect(() => {
    if (!roleInfo) {
      return;
    }
    const resPhaseInfo: ICluePhaseProps = {
      clueId: get(followInfo, 'clueId'),
      phase: get(followInfo, 'phase'),
      owners: [
        {
          name: get(followInfo, 'ownerName', ''),
          ownerId: get(followInfo, 'ownerUserId', 0),
          userId: get(followInfo, 'ownerUserId', 0)
        }
      ],
      kdtId: get(sourceInfo, 'sourceKdtId'),
      roleId: get(roleInfo, '[0]roleId')
    };
    setPhaseData(resPhaseInfo);
    if (resPhaseInfo.clueId !== undefined) {
      // 拿到线索数据之后触发更新
      updateSignalByMerge(['clueModifyRecords']);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followInfo, roleInfo, sourceInfo]);

  const prefixContentData = React.useMemo(
    () => getAddonAttributes(studentNo, (customerInfo as unknown) as AddonCustomParamsType),
    [customerInfo, studentNo]
  );

  const passiveStudentInfo = React.useMemo(() => collectStudentInfo(studentNo, studentId, studentInfo), [
    studentId,
    studentInfo,
    studentNo
  ]);
  const passiveCustomerInfo = React.useMemo(() => collectCustomerInfo(customerInfo), [customerInfo]);
  const passiveCampusInfo = React.useMemo(() => collectCampusInfo(campusList, selectedCampusKdtId), [
    campusList,
    selectedCampusKdtId
  ]);

  return (
    <div className="student-detail">
      <StudentCard
        studentNo={studentNo}
        studentId={studentId}
        prefixContent={prefixContentData}
        onStudentInfoChange={handleStudentInfo}
        updatingSignal={updatingSignal.studentCard}
        fetchOnMounted={source === 'ability-center'}
      >
        {rawData => {
          return (
            <div className="student-card__content">
              <StudentCampusList {...passiveCampusInfo} />
              {contractInfo.length > 0 && <MemberList members={contractInfo} />}
              {sourceInfo && (
                <Divider className="student-card__content-line">
                  <SourceInfo data={(sourceInfo as unknown) as ISourceInfo} />
                </Divider>
              )}
              {phaseData && (
                <Divider className="student-card__content-line">
                  <OtherStudentInfo
                    {...phaseData}
                    revisitTime={get(followInfo, 'revisitTime')}
                    ownerSchoolName={get(followInfo, 'ownerSchoolName', '')}
                    // 这里直接从renderChildren拿这个字段比较方便，因为没有复用的地方，不单独写成state
                    createdAt={get(rawData, 'createdAt')}
                  />
                </Divider>
              )}
            </div>
          );
        }}
      </StudentCard>
      {/* 虽然没啥用，但是还是用一个标签来分割按钮组 */}
      <div className="student-detail__content-rightPart">
        <div className="student-detail__content operator-line">
          {isInStoreCondition({ supportHqStore: true }) &&
            passiveCampusInfo.campusOptions.length > 1 && (
            <div className="campus-selector">
              <label>当前查看校区：</label>
              <Select
                options={passiveCampusInfo.campusOptions}
                value={selectedCampusKdtId}
                onChange={setCampusKdtId}
                clearable={false}
              />
            </div>
          )}
          <OperatorButtons
            className="button-list"
            {...phaseData}
            {...passiveStudentInfo}
            {...passiveCustomerInfo}
            {...passiveCampusInfo}
            sourceInfo={sourceInfo}
            onActionCallback={handleActionCallBack}
          />
        </div>
        {phaseData && (
          <section>
            <Divider className="student-detail__content">
              <CluePhase {...phaseData} needCheckAccess={false} onChange={handleCluePhaseChange} />
            </Divider>
            <Divider className="student-detail__content">
              <ClueTag
                {...phaseData}
                tags={tagsInfo}
                needCheckAccess={false}
                onAdd={handleClueTagsChange}
              />
            </Divider>
            <Divider className="student-detail__content tabs-container">
              <TabsContainer
                className="tab-panel-wrapper"
                type="card"
                {...passiveStudentInfo}
                {...passiveCampusInfo}
                clueInfo={phaseData}
                updatingSignal={updatingSignal}
                onActionCallback={handleActionCallBack}
              />
            </Divider>
          </section>
        )}
      </div>
    </div>
  );
};

export default StudentDetail;

function collectStudentInfo(
  studentNo: string,
  studentId: string,
  studentInfo: Record<string, any>
) {
  return {
    studentNo,
    studentId,
    studentName: get(studentInfo, 'name', '') as string,
    studentPhone: get(studentInfo, 'mobile', '')
  };
}

function collectCustomerInfo(customerInfo: Record<string, any>) {
  return {
    customerId: get(customerInfo, 'userId', 0) as number
  };
}

function collectCampusInfo(campusList: Record<string, any>[], selectedCampusKdtId: any) {
  const campusOptions: IOption[] = campusList.map(campus => ({
    text: get(campus, 'name'),
    value: get(campus, 'kdtId')
  }));
  const campusKdtId = get(selectedCampusKdtId, '[0]');
  const currentCampus = find(campusOptions, { value: campusKdtId });
  return {
    campusList,
    campusOptions,
    campusKdtId,
    selectedCampusKdtId: campusKdtId,
    campusName: get(currentCampus, 'text', '')
  };
}
