import React, { FC, useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { RouteComponentProps } from 'react-router';
import { Notify, BlockLoading } from 'zent';
import { Button as SamButton, Link as SamLink } from '@youzan/sam-components';
import { EasyList } from '@youzan/ebiz-components';
import { BlankLink } from '@youzan/react-components';
import { date } from '@youzan/utils';
import {
  IEasyGridColumn,
  ICombinedFilterConf,
  IListContext,
} from '@youzan/ebiz-components/es/types/easy-list';
import { StudentDetailLink } from '@ability-center/student';
import { getClueDetailUrl } from '@ability-center/clue';
import { getExportRecordUrl, EXPORT_RECORD_TYPES } from '@ability-center/ump/export-record';
import useAllCampusList from '@ability-center/common/use-all-campus-list';
import { desensitivePhone } from 'fns/text/caculate';
import { ActivityBanner, ActivityBannerData } from '../../components/activity-banner';
import { EmptyListTips } from '../../components/empty-list-tips';
import { findNewStudentList, getDetail, exportNewStudentData } from '../../api';
import { dateRangeQuickPickerPreset } from '../../constants';
import { ClueStates } from '../../types';
import { log } from '../../utils/logger';
import { getAbilitys } from '../../utils';

import './style.scss';

interface FindNewStudentListQuery {
  activityId: string;
  newStudentStatus: string;
  newStudentName?: string;
  newPhoneNo?: string;
  oldStudentName?: string;
  introduceStartTime?: string;
  introduceEndTime?: string;
  campusKdtId?: number;
}

const { List, EasyGrid, Filter } = EasyList;
/** 31天毫秒数 */
const ONE_MONTH_TIME = 2678400000;

const exportDataUrl = getExportRecordUrl({ type: EXPORT_RECORD_TYPES.INVITE_REWARD_NEW_STUDENT });

const clueStatesOption = [
  { text: '全部', value: ClueStates.defaultState },
  { text: '待分配', value: ClueStates.toBeAssigned },
  { text: '待跟进', value: ClueStates.toBeFollowedUp },
  { text: '待邀约', value: ClueStates.followUp },
  { text: '待试听', value: ClueStates.invited },
  { text: '已试听', value: ClueStates.auditioned },
  { text: '已成交', value: ClueStates.completed },
  { text: '已删除', value: ClueStates.deleted },
  { text: '已放弃', value: ClueStates.abandoned },
  { text: '永久删除', value: ClueStates.permanentlyDeleted },
].map(it => ({
  ...it,
  value: `${it.value}`,
}));

const clueStatesName = clueStatesOption.reduce((obj, curr) => {
  obj[curr.value] = curr.text;
  return obj;
}, {});

// 时间范围是否超过31天
function isMoreThanMonth(startTime: string, endTime: string) {
  return (
    date.parseDate(endTime, 'YYYY-MM-DD HH:mm:ss').getTime() -
      date.parseDate(startTime, 'YYYY-MM-DD HH:mm:ss').getTime() >=
    ONE_MONTH_TIME
  );
}

export const NewStudents: FC<RouteComponentProps<{ id: string }, {}>> = ({ params: { id } }) => {
  const [activityData, setActivityData] = useState<ActivityBannerData | null>(null);
  const [filterData, setFilterData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const listRef = useRef<IListContext | null>(null);
  const abilitys = useMemo(() => {
    return getAbilitys();
  }, []);
  const columns: IEasyGridColumn[] = useMemo(() => {
    return [
      {
        title: '新学员',
        name: 'newStudentName',
        bodyRender: data =>
          data.newStudentStatus === ClueStates.permanentlyDeleted ? (
            <>
              <div>{data.newStudentName}</div>
              <div>{desensitivePhone(data.newStudentPhoneNo)}</div>
            </>
          ) : (
            <>
              <BlankLink href={getClueDetailUrl('all', data.newStudentClueId)}>
                {data.newStudentName}
              </BlankLink>
              <div>{desensitivePhone(data.newStudentPhoneNo)}</div>
            </>
          ),
      },
      {
        title: '新学员跟进状态',
        name: 'newStudentStatus',
        bodyRender: ({ newStudentStatus }) => clueStatesName[newStudentStatus],
      },
      abilitys.chainStore && abilitys.introductionDataView && {
        title: '适用校区',
        name: 'newStudentCampusName',
        bodyRender: ({ newStudentCampusName }) => newStudentCampusName,
      },
      {
        title: '介绍人',
        name: 'oldStudentName',
        bodyRender: ({ oldStudentFlag, oldStudentName, oldStudentId, oldStudentUserId }) => {
          if (!oldStudentName) {
            return '-';
          }
          if (!abilitys.introductionDataView) {
            return oldStudentName;
          }
          if (oldStudentFlag) {
            return <StudentDetailLink studentId={oldStudentId}>{oldStudentName}</StudentDetailLink>;
          } else {
            return (
              <BlankLink
                href={`${_global.url.v4}/scrm/customer/manage#/detail?yzUid=${oldStudentUserId}`}
              >
                {oldStudentName}
              </BlankLink>
            );
          }
        },
      },
      {
        title: '介绍时间',
        name: 'introduceTime',
        textAlign: 'right',
        bodyRender: ({ introduceTime }) => date.makeDateTimeStr(introduceTime),
      },
    ];
  }, [abilitys.chainStore, abilitys.introductionDataView]);
  const [schoolOptions] = useAllCampusList();

  const filterConfig: ICombinedFilterConf[] = useMemo(() => {
    const config: ICombinedFilterConf[] = [
      {
        name: 'newStudentName',
        label: '新学员姓名：',
        type: 'Input',
      },
      {
        name: 'newPhoneNo',
        label: '新学员手机号：',
        type: 'Input',
      },
      {
        name: 'newStudentStatus',
        label: '新学员跟进状态：',
        type: 'Select',
        inheritProps: { width: 200 },
        options: clueStatesOption,
        defaultValue: `${ClueStates.defaultState}`,
      },
      {
        name: 'oldStudentName',
        label: '介绍人姓名：',
        type: 'Input',
      },
      {
        name: 'timeRange',
        label: '介绍时间：',
        type: 'DateRangeQuickPicker',
        inheritProps: {
          format: 'YYYY-MM-DD HH:mm:ss',
          preset: [
            {
              text: '本周',
              value: [
                dateRangeQuickPickerPreset.currentMondayStart,
                dateRangeQuickPickerPreset.nowDateTime,
              ],
            },
            {
              text: '上周',
              value: [
                dateRangeQuickPickerPreset.lastMondayStart,
                dateRangeQuickPickerPreset.lastSundayEnd,
              ],
            },
            {
              text: '本月',
              value: [
                dateRangeQuickPickerPreset.currentMonthStart,
                dateRangeQuickPickerPreset.nowDateTime,
              ],
            },
            {
              text: '上月',
              value: [
                dateRangeQuickPickerPreset.lastMonthStart,
                dateRangeQuickPickerPreset.lastMonthEnd,
              ],
            },
          ],
        },
      },
    ];
    if (abilitys.chainStore && abilitys.introductionDataView) {
      config.push({
        name: 'campusKdtId',
        label: '所属校区：',
        inheritProps: {
          filter(item, keyword) {
            return item.text.includes(keyword);
          },
        },
        type: 'Select',
        defaultValue: 'all',
        options: schoolOptions,
      });
    }
    return config;
  }, [abilitys.chainStore, abilitys.introductionDataView, schoolOptions]);
  useEffect(() => {
    getDetail({ query: { id } }).then(data => {
      const {
        alias,
        baseInfoSetting: { name, startAt, endAt },
        ruleSetting: { newStudentRewardSettingType },
        newStudentPageSetting: { showJoinNum },
        status,
      } = data;
      setActivityData({
        name,
        startAt,
        endAt,
        status,
      });
      log({
        et: 'view',
        ei: 'enter_new_students_list',
        en: '进入新学员列表页',
        params: {
          showJoinNum,
          newStudentRewardType: newStudentRewardSettingType,
          name,
          alias,
        },
      });
    });
  }, [id]);
  const fetchData = useCallback(
    data => {
      setFilterData(data);
      const {
        page: pageNumber,
        newStudentStatus = `${ClueStates.defaultState}`,
        newStudentName = '',
        newPhoneNo = '',
        oldStudentName = '',
        timeRange = [],
        campusKdtId = '',
      } = data;
      const [introduceStartTime, introduceEndTime] = timeRange[0] || [];
      const query: FindNewStudentListQuery = {
        activityId: id,
        newStudentStatus,
        newStudentName,
        newPhoneNo,
        oldStudentName,
        campusKdtId,
      };

      if (!campusKdtId || campusKdtId === 'all') {
        delete query.campusKdtId;
      }

      // 开始和结束时间没有同时选择
      if (!!introduceStartTime !== !!introduceEndTime) {
        Notify.error('请选择介绍时间');
        return Promise.reject();
      }
      if (introduceStartTime && introduceEndTime) {
        if (isMoreThanMonth(introduceStartTime, introduceEndTime)) {
          Notify.error('时间范围选择不允许超过1个月');
          return Promise.reject();
        }
        query.introduceStartTime = introduceStartTime;
        query.introduceEndTime = introduceEndTime;
      }

      return findNewStudentList({
        pageRequest: {
          pageSize: 10,
          pageNumber,
          sort: {
            orders: [
              {
                direction: 'DESC',
                property: 'createdAt', // 按介绍时间排序，用的是createdAt而不是introduceTime
              },
            ],
          },
        },
        query,
      })
        .then(({ content, pageable, total }) => ({
          // pageable在content为空列表时会为null
          dataset: content,
          pageInfo: {
            page: pageable ? pageable.pageNumber : 1,
            pageSize: pageable ? pageable.pageSize : 10,
            total,
          },
        }))
        .catch(err => {
          throw Notify.error(err);
        });
    },
    [id],
  );

  const onExport = useCallback(() => {
    const { timeRange = [], ...query } = filterData;
    const [introduceStartTime, introduceEndTime] = timeRange[0] || [];
    if (!introduceStartTime || !introduceEndTime) {
      Notify.error('请选择介绍时间');
      return;
    }
    if (isMoreThanMonth(introduceStartTime, introduceEndTime)) {
      Notify.error('时间范围选择不允许超过1个月');
      return;
    }
    setLoading(true);
    if (!query.campusKdtId || query.campusKdtId === 'all') {
      delete query.campusKdtId;
    }
    exportNewStudentData({
      query: {
        ...query,
        activityId: id,
        introduceStartTime,
        introduceEndTime,
      },
    })
      .then(() => {
        window.open(exportDataUrl, '_blank');
        setLoading(false);
      })
      .catch(err => {
        Notify.error(err);
        setLoading(false);
      });
  }, [filterData, id]);
  return (
    <div className="activity-list">
      <BlockLoading loading={loading}>
        {activityData && <ActivityBanner activity={activityData} />}
        <List
          defaultFilter={{ pageSize: 10, page: 1 }}
          ref={listRef}
          mode="hash"
          onSubmit={fetchData}
        >
          <Filter
            onChange={(_, queryData) => setFilterData(queryData)}
            actionsOption={{
              beforeReset: (
                <>
                  <SamButton name="转介绍导出" onClick={onExport}>
                    导出
                  </SamButton>
                  <SamLink
                    name="转介绍导出"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={exportDataUrl}
                    style={{ marginLeft: 16, position: 'relative', top: '2px' }}
                  >
                    查看已导出列表
                  </SamLink>
                </>
              ),
            }}
            config={filterConfig}
          />
          <EasyGrid
            columns={columns}
            emptyLabel={<EmptyListTips>没有更多数据了</EmptyListTips>}
            rowKey="newStudentId"
          />
        </List>
      </BlockLoading>
    </div>
  );
};
