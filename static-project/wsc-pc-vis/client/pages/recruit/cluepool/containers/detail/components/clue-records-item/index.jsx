import React, { useMemo, useCallback } from 'react';
import { format } from 'date-fns';
import { Dialog, Img } from '@youzan/ebiz-components';
import RecordDetail from '../detail-panel/RecordDetail';

import { ShowWrapper } from 'fns/chain';
import { isEduChainStore, isEduBranchStore } from '@youzan/utils-shop';
import { getAllPhaseText } from '../../utils/get-phase-text';
import ItemHeader from './ItemHeader';
import { checkOrderBelongsTo } from '../../../../api';
import './style.scss';
import { Notify } from 'zent';
import { ClueRecordTypes } from '@ability-center/clue';

export { default as UpdateTagsItem } from './UpdateTagsItem';
export { default as UpdateRecordItem } from './UpdateRecordItem';

const { openDialog } = Dialog;
const { ImgWrap } = Img;

const checkOrder = (orderNo, clueId) => {
  if (isEduBranchStore) {
    checkOrderBelongsTo({
      orderNo,
      clueId,
    })
      .then(() => {
        window.open(`${window._global.url.v4}/trade/order/detail?orderNo=${orderNo}`);
      })
      .catch((err) => {
        Notify.error(err);
      });
  } else {
    window.open(`${window._global.url.v4}/trade/order/detail?orderNo=${orderNo}`);
  }
};

// 添加线索
export const AddItem = ({ data }) => {
  const { operateInfo } = data;
  const { channel, source, owners = [], operatorSchoolName, schoolName } = operateInfo;

  const ownerStr = useMemo(() => {
    let str = '';

    owners.forEach(({ ownerName }, i) => {
      str += ownerName;
      if (i < owners.length - 1) {
        str += '、';
      }
    });

    return str;
  }, [owners]);

  return (
    <>
      <ItemHeader data={operateInfo} phase="添加线索" />
      <div className="item__body">
        <p>添加方式：{channel}</p>
        <p>
          线索来源：{source || '-'}
          <ShowWrapper isInStoreCondition={isEduChainStore}>（{operatorSchoolName}）</ShowWrapper>
        </p>
        <ShowWrapper isInStoreCondition={isEduChainStore}>
          <p>所属校区：{schoolName || '-'}</p>
        </ShowWrapper>
        <p>课程顾问：{ownerStr || '-'}</p>
      </div>
    </>
  );
};

// 变更来源
export const UpdateSourceItem = ({ data }) => {
  const { operateInfo } = data;
  const { afterSource = [], beforeSource = [] } = operateInfo;

  return (
    <>
      <ItemHeader data={operateInfo} phase="更新来源" />
      <div className="item__body">
        <p>
          <span>变更后：</span>
          {afterSource.groupName} - {afterSource.name}
        </p>
        <p className="gray">
          <span>变更前：</span>
          {beforeSource.groupName} - {beforeSource.name}
        </p>
      </div>
    </>
  );
};

// 变更角色
export const UpdateRoleItem = ({ data }) => {
  const ROLE_MAP = {
    1: '学员',
    2: '教师',
    3: '管理员',
    // 线索使用
    4: '线索',
    5: '潜在客户',
  };

  const SCENE_MAP = {
    manualChange: '手动转化',
    offlineSign: '员工办理报名',
    signFormal: '用户报名正式课',
    collectZan: '好友助力',
    poster: '公众号海报',
    gift: '通用赠品活动',
  };

  const { operateInfo, clueId } = data;
  const { afterRole = 0, beforeRole = 0, scene, relatedInfo } = operateInfo;
  const { orderNo } = relatedInfo || {};

  return (
    <>
      <ItemHeader data={operateInfo} phase="变更角色" />
      <div className="item__body">
        <p>
          <span>变更后：</span>
          {ROLE_MAP[afterRole] || '-'}
        </p>
        <p className="gray">
          <span>变更前：</span>
          {ROLE_MAP[beforeRole] || '-'}
        </p>
        <p className="item__body">
          <span>变更原因：</span>
          {SCENE_MAP[scene] || '-'}
          {orderNo ? (
            <span className="item__body__order">
              <a
                onClick={() => {
                  checkOrder(orderNo, clueId);
                }}
                rel="noopener noreferrer"
              >
                查看成交信息
              </a>
            </span>
          ) : null}
        </p>
      </div>
    </>
  );
};

// 更新阶段
export const UpdatePhaseItem = ({ data }) => {
  const { operateInfo, clueId } = data;
  const { phaseAfter, phaseBefore } = operateInfo;

  return (
    <>
      <ItemHeader data={operateInfo} phase="更新阶段" />
      <div className="item__body">
        <div>
          <span>变更后：{getAllPhaseText(phaseAfter)}</span>
          {operateInfo.reason ? (
            <span className="item__body__reason">原因：{operateInfo.reason}</span>
          ) : null}
          {operateInfo.relatedOrderNo ? (
            <span className="item__body__order">
              <a
                onClick={() => {
                  checkOrder(operateInfo.relatedOrderNo, clueId);
                }}
                rel="noopener noreferrer"
              >
                查看成交信息
              </a>
            </span>
          ) : null}
        </div>
        <p className="gray">变更前：{getAllPhaseText(phaseBefore)}</p>
      </div>
    </>
  );
};

// 变更课程顾问
export const UpdateOwnersItem = ({ data }) => {
  const { operateInfo } = data;
  const { afterOwner = [], beforeOwner = [], reason } = operateInfo;

  return (
    <>
      <ItemHeader data={operateInfo} phase="变更课程顾问" />
      <div className="item__body">
        <p>
          <span>变更后：</span>
          {afterOwner.map(({ name, telephone, schoolName }, i) => (
            <span key={i}>
              {name || '-'}
              {` ${telephone}`}
              {isEduChainStore ? `(${schoolName})` : ' '}
            </span>
          ))}
          {afterOwner.length === 0 && '-'}
        </p>
        <p className="gray">
          <span>变更前：</span>
          {beforeOwner.map(({ name, telephone, schoolName }, i) => (
            <span key={i}>
              {name || '-'}
              {` ${telephone}`}
              {isEduChainStore ? `(${schoolName})` : ' '}
            </span>
          ))}
          {beforeOwner.length === 0 && '-'}
        </p>
        <p>变更原因：{reason || '-'}</p>
      </div>
    </>
  );
};

// 更新基本资料
export const UpdateStuItem = ({ data }) => {
  const { operateInfo } = data;
  const { stuAfter = [], stuBefore = [] } = operateInfo;

  return (
    <>
      <ItemHeader data={operateInfo} phase="更新基本资料" />
      <div className="item__body">
        <p>
          <span>变更后：</span>
          {stuAfter.map(({ attributeId, attributeTitle, attributeKey, attributeValue }, i) =>
            attributeKey === 'edu_stuAva' ? (
              <div key={attributeId}>
                <span>{`${attributeTitle || '-'}：`}</span>
                <ImgWrap width="40px" height="40px" src={attributeValue} alt={attributeValue} />
                <span>{`${i !== stuAfter.length - 1 ? '，' : ''}`}</span>
              </div>
            ) : (
              <span key={attributeId}>
                {`${attributeTitle || '-'}：${attributeValue || '-'}${
                  i !== stuAfter.length - 1 ? '，' : ''
                }`}
              </span>
            ),
          )}
          {stuAfter.length === 0 && '-'}
        </p>
        <p className="gray">
          <span>变更前：</span>
          {stuBefore.map(({ attributeId, attributeTitle, attributeKey, attributeValue }, i) =>
            attributeKey === 'edu_stuAva' ? (
              <div key={attributeId}>
                <span>{`${attributeTitle || '-'}：`}</span>
                <ImgWrap width="40px" height="40px" src={attributeValue} alt={attributeValue} />
                <span>{`${i !== stuAfter.length - 1 ? '，' : ''}`}</span>
              </div>
            ) : (
              <span key={attributeId}>
                {`${attributeTitle || '-'}：${attributeValue || '-'}${
                  i !== stuBefore.length - 1 ? '，' : ''
                }`}
              </span>
            ),
          )}
          {stuBefore.length === 0 && '-'}
        </p>
      </div>
    </>
  );
};

/**
 * 系统自动添加
 * 7: 提交报名表单信息
 * 8: 体验课报名
 * 9: 好友助力
 * 10: 公众号海
 * 14: 转介绍
 *
 * @param {any} props -
 * @return {any}
 */
export const SystemAddItem = ({ data }) => {
  const { recordType, operateInfo } = data;
  const operateInfoMemo = useMemo(() => {
    return Object.assign({}, operateInfo, { operatorName: '系统添加' });
  }, [operateInfo]);

  const {
    operatorName,
    owners = [],
    source,
    attendTime,
    attendAddress,
    courseName,
    introduceName,
    regInfo = [],
    operation, // 线索详情的操作项
  } = operateInfoMemo;

  const dialogTitle = operation && operation.replace(/查看/, ''); // 查看报名详情 or 查看表单详情

  const openDetailDialog = useCallback(() => {
    openDialog(RecordDetail, {
      title: dialogTitle,
      data: {
        attributes: regInfo,
      },
    });
  }, [dialogTitle, regInfo]);

  const ownerStr = useMemo(() => {
    let str = '';

    owners.forEach(({ ownerName }, i) => {
      str += ownerName;
      if (i < owners.length - 1) {
        str += '、';
      }
    });

    return str;
  }, [owners]);

  const sourceMemo = useMemo(() => {
    let subtext;
    switch (recordType) {
      case ClueRecordTypes.TRAIL_SIGN_UP:
        subtext = (
          <p className="source-detail gray">
            <span>
              意向上课时间：{attendTime ? format(attendTime, 'YYYY-MM-DD HH:mm:ss') : '-'}
            </span>
            <span style={{ marginLeft: '18px' }}>意向上课地点：{attendAddress || '-'}</span>
          </p>
        );
        break;
      case ClueRecordTypes.BOOST_UP:
      case ClueRecordTypes.POSTER:
        subtext = <p className="source-detail gray">报名课程：{courseName || '-'}</p>;
        break;
    }

    return (
      <div>
        <p className="source_name">{source}</p>
        {subtext}
      </div>
    );
  }, [attendAddress, attendTime, courseName, recordType, source]);

  return (
    <>
      <ItemHeader data={operateInfoMemo} phase="添加线索" />
      <div className="item__body">
        <p>添加方式：{operatorName}</p>
        <div className="item__body__system-source">
          <span>线索来源：</span>
          {sourceMemo}
          {operation && (
            <span className="cursor-link" onClick={openDetailDialog}>
              查看{dialogTitle}
            </span>
          )}
        </div>
        {recordType === ClueRecordTypes.INTRO_TRANSFER && <p>介绍人：{introduceName || '-'}</p>}
        <p>课程顾问：{ownerStr || '-'}</p>
      </div>
    </>
  );
};
