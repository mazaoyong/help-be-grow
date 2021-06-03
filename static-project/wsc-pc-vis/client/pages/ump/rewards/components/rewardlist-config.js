import { Pop } from '@zent/compat';
import React from 'react';
import { isEduHqStore, isEduBranchStore } from '@youzan/utils-shop';
import SchoolTD from '@ability-center/shop/school-td';
import { LinkGroup } from '@youzan/ebiz-components';
import { arrayColumnWrapper } from 'fns/chain/index';
import { REWARD_STATUS, COURSE_URL } from '../constants.js';
import get from 'lodash/get';
import { format } from 'date-fns';
import PopContent from '../components/delete-confirm-pop';

function filterOptions() {
  return arrayColumnWrapper([
    {
      type: 'Input',
      name: 'activityName',
      label: '活动名称：',
    },
    {
      type: 'Select',
      name: 'campusKdtId',
      chainState: isEduHqStore,
      label: '适用校区：',
      data: this.state.campusList,
    },
    {
      type: 'Select',
      name: 'activityStatus',
      label: '活动状态：',
      data: [
        {
          value: 0,
          text: '全部',
        },
        {
          value: 1,
          text: '未开始',
        },
        {
          value: 2,
          text: '进行中',
        },
        {
          value: 3,
          text: '已失效',
        },
        {
          value: 4,
          text: '已结束',
        },
      ],
      props: {
        placeholder: '全部',
      },
    },
  ]);
}

function rewardColumns(id) {
  const prev = [
    {
      title: '活动名称',
      name: 'activityName',
      fixed: 'left',
      width: '200px',
      bodyRender: ({ courseProductDTO, activityName }) => {
        return (
          <div className="reward-value-cell">
            {courseProductDTO ? (
              <a
                className="coursename-link"
                onClick={() =>
                  window.open(
                    `${COURSE_URL}?alias=${courseProductDTO.alias}&kdt_id=${courseProductDTO.kdtId}`,
                  )
                }
              >
                {' '}
                {activityName}{' '}
              </a>
            ) : (
              <span>{activityName}</span>
            )}
          </div>
        );
      },
    },
    {
      title: '奖励内容',
      name: 'award',
      width: '15%',
      bodyRender: ({ awardDTOList = [], courseProductDTO }) => {
        const awardValues = awardDTOList.map(item => {
          return {
            awardType: item.awardType,
            awardValue: item.awardValue,
            voucherCouponAwardDetailDTO: item.voucherCouponAwardDetailDTO,
          };
        });
        if (awardValues && awardValues.length) {
          switch (awardValues[0].awardType) {
            case 1:
              const awardValue = awardValues
                .map(item => {
                  if (item.voucherCouponAwardDetailDTO) {
                    return `${item.voucherCouponAwardDetailDTO.title}（${item.awardValue}张）`;
                  }
                  return `优惠券（${item.awardValue}张）`;
                })
                .join();
              return (
                <Pop
                  trigger="hover"
                  content={<div style={{ maxWidth: '200px' }}>{awardValue}</div>}
                >
                  <span className="reward-value-cell">
                    {awardValue}
                    {/* {awardValue.length > 12 ? `${awardValue.slice(0, 12)}..` : awardValue} */}
                  </span>
                </Pop>
              );
            case 4:
              return (
                <span className="reward-value-cell">{`${awardValues[0].awardValue}积分`}</span>
              );
            case 2:
              return (
                <span className="reward-value-cell">
                  {get(courseProductDTO, 'courseSellType') === 1
                    ? `赠送${awardValues[0].awardValue / 100}课时`
                    : `赠送${awardValues[0].awardValue}天`}
                </span>
              );
            case 3:
              return <span className="reward-value-cell">{`体验课`}</span>;
          }
        }
        return null;
      },
    },
    {
      title: '发放条件',
      name: 'rewardCondition',
      width: '15%',
      chainState: id === 'processing',
      bodyRender: ({ rewardConditionDTO }) => {
        if (rewardConditionDTO && rewardConditionDTO.rewardNodeType) {
          switch (rewardConditionDTO.rewardNodeType) {
            case 1:
              switch (rewardConditionDTO.conditionType) {
                case 1:
                  return (
                    <span className="rewardcondition-value-cell">{`消课课时达${
                      rewardConditionDTO.conditionValue / 100
                    }课时`}</span>
                  );
                case 2:
                  return (
                    <span className="rewardcondition-value-cell">{`课程生效${rewardConditionDTO.conditionValue}天后`}</span>
                  );
                case 3:
                case 0:
                  return (
                    <span className="rewardcondition-value-cell">{`开课时间${rewardConditionDTO.conditionValue}天后`}</span>
                  );
              }
              break;
            case 2:
              return <span className="rewardcondition-value-cell">{'入学奖励'}</span>;
            case 3:
              return <span className="rewardcondition-value-cell">{'毕业奖励'}</span>;
            case 4:
              return (
                <span className="rewardcondition-value-cell">{`每完成${rewardConditionDTO.conditionValue}次消课`}</span>
              );
          }
        }
        return null;
      },
    },
    {
      title: '活动时间',
      name: 'createdAt',
      width: '240px',
      bodyRender: ({ startAt, endAt }) => {
        return (
          <>
            <p className="createtime-value-cell">{format(startAt, 'YYYY-MM-DD HH:mm:ss')} 至 </p>
            <p className="createtime-value-cell">{format(endAt, 'YYYY-MM-DD HH:mm:ss')}</p>
          </>
        );
      },
    },
  ];
  const last = [
    {
      title: '活动状态',
      name: 'rewardStatus',
      width: '8%',
      bodyRender: ({ activityStatus }) => {
        return <span className="reward-status-cell">{REWARD_STATUS[activityStatus - 1]}</span>;
      },
    },
    {
      title: '操作',
      name: 'rewardOperate',
      width: '200px',
      fixed: 'right',
      textAlign: 'right',
      bodyRender: ({ activityId, activityStatus, kdtId, rewardConditionDTO }) => {
        const onlyHqShow = !isEduBranchStore && !+this.state.campusId;
        const { rewardNodeType } = rewardConditionDTO;
        const operate = [
          {
            text: '编辑',
            show: activityStatus === 1 && onlyHqShow && rewardNodeType !== 1,
            onClick: () => {
              this.props.router.push(`/edit/${activityId}?campusKdtId=${kdtId}&type=${id}`);
            },
          },
          {
            text: '查看',
            show:
              (activityStatus > 1 ||
                isEduBranchStore ||
                (isEduHqStore && !!+this.state.campusId)) &&
              rewardNodeType !== 1,
            onClick: () => {
              this.props.router.push(`/view/${activityId}?campusKdtId=${kdtId}&type=${id}`);
            },
          },
        ];

        if (activityStatus >= 3 && onlyHqShow) {
          operate.push(
            <PopContent
              rewardActivityId={activityId}
              status={3}
              updateStatus={() => this.updateStatus(activityId, 3)}
              refresh={() => this.refreshList().refresh()}
            >
              <a>删除</a>
            </PopContent>,
          );
        }
        if (activityStatus < 3 && onlyHqShow) {
          operate.push(
            <PopContent
              rewardActivityId={activityId}
              status={2}
              updateStatus={() => this.updateStatus(activityId, 2)}
              refresh={() => this.refreshList().refresh()}
            >
              <a>失效</a>
            </PopContent>,
          );
        }
        operate.push({
          text: '发放记录',
          show: activityStatus > 1,
          onClick: () => {
            this.props.router.push(
              `/recordslist/${id}?activityId=${activityId}&campusKdtId=${kdtId}&rewardNodeType=${rewardNodeType}`,
            );
          },
        });

        return (
          <>
            <LinkGroup
              data={operate.filter(item => {
                return get(item, 'show') !== false;
              })}
            />
          </>
        );
      },
    },
  ];
  let columns = [];
  if (+this.state.campusId) {
    columns = [...prev, ...last];
  } else {
    columns = [
      ...prev,
      {
        title: '适用校区',
        chainState: isEduHqStore,
        width: '10%',
        bodyRender: ({ activityName, isAllCampus, applyCampusList }) => {
          return (
            <SchoolTD
              label="活动名称："
              name={activityName}
              designateType={isAllCampus}
              designatedKdtIds={applyCampusList}
            />
          );
        },
      },
      ...last,
    ];
  }
  return arrayColumnWrapper(columns);
}

export { filterOptions, rewardColumns };
