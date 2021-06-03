// 左侧详情
import React, { useMemo, useCallback } from 'react';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import { Icon, Tag, BlockLoading } from 'zent';
import { format, differenceInCalendarDays, isSameDay } from 'date-fns';
import { Icon as EbizIcon, Img } from '@youzan/ebiz-components';
import { Link as SamLink } from '@youzan/sam-components';
import openAddDialog from '../../../../components/add-dialog';
import store from '../../store';

import getAttributeValue from '../../utils/get-attribute-value';
import getCurClueId from '../../utils/get-cur-clueid';
import Actions from './Actions';
import './style.scss';
import ActiveDetail from './ActiveDetail';
import { getAge } from '@ability-center/student';

const defaultAvatar = 'https://b.yzcdn.cn/edu/clue/detaultavatar.png';
const { ImgWrap } = Img;
// 处理年龄和生日的逻辑
function handleAge(items) {
  const birthDayConf = findIndex(items, { attributeKey: 'edu_stuBirth' });
  const ageConf = findIndex(items, { attributeKey: 'edu_stuAge' });

  if (birthDayConf > 0 && ageConf > 0) {
    const calcAge = getAge(get(items, `[${birthDayConf}].attributeValue`));
    if (calcAge) {
      items[ageConf].attributeValue = calcAge;
    }
  }
  return items;
}

const DetailPanel = () => {
  const clueId = getCurClueId();
  const storeState = store.useStoreState();
  const {
    studentLoading,
    avatar,
    name,
    telephone,
    attributes,
    source,
    createdAt,
    owners,
    sex,
    kdtId,
    roleId,
    revisitTime,
    phase,
  } = storeState;

  const isOwner = useMemo(() => owners.filter(({ userId }) => userId === _global.userId).length > 0, [owners]);
  const isDeleted = useMemo(() => phase === 8, [phase]);
  const isShopMember = useMemo(
    () => (kdtId === window._global.kdtId) && (roleId === 1) && (owners.length > 0),
    [kdtId, roleId, owners],
  );
  // 是否属于当前用户店铺
  const isOwnStore = useMemo(() => _global.kdtId === storeState.kdtId, [storeState.kdtId]);

  const ownersText = useMemo(() => {
    let text = '';
    owners.forEach(({ name }, i) => {
      text += name;
      if (i < owners.length - 1) {
        text += '、';
      }
    });
    return text || '-';
  }, [owners]);

  // 过滤头像，手机号和姓名
  const filtedAttributes = useMemo(() => {
    let ATTRS = attributes
      .filter(({ attributeKey }) => !['edu_stuAva', 'edu_stuName', 'edu_stuSex', 'edu_stuContractPhone'].includes(attributeKey));

    // 处理生日和年龄
    ATTRS = handleAge(ATTRS);

    return ATTRS;
  }, [attributes]);

  const handleEdit = useCallback(() => {
    openAddDialog('mine', () => {
      store.getDetail();
    }, {
      attributes,
      avatar,
      name,
      telephone,
      source,
      sex,
      clueId: clueId,
      isEdit: true,
    });
  }, [attributes, avatar, clueId, name, sex, source, telephone]);

  const revisitTimeTag = useMemo(() => {
    const differentday = differenceInCalendarDays(revisitTime, new Date());

    if (isSameDay(revisitTime, new Date())) {
      return <Tag theme="red" outline>今天</Tag>;
    }

    if (differentday < 0) {
      return <Tag theme="red" outline>已逾期</Tag>;
    }
    if (differentday < 1) {
      return <Tag theme="red" outline>今天</Tag>;
    } else if (differentday < 2) {
      return <Tag theme="green" outline>距今{differentday}天</Tag>;
    } else {
      return <Tag theme="green" outline>距今{differentday}天</Tag>;
    }
  }, [revisitTime]);

  const sexIconType = (sex === '男' || sex === '1') ? 'boy' : ((sex === '女' || sex === '2') ? 'girl' : '');

  return (
    <aside className="clue-detail__panel">
      <p className="clue-detail__panel__edit">
        {isOwner &&
          isOwnStore &&
          !isDeleted &&
          (
            <span className="cursor-link" onClick={handleEdit}>
              <Icon type="edit-o" />
              编辑
            </span>
          )}
        {!isOwner &&
          isShopMember &&
          !isDeleted &&
          (
            <SamLink name="编辑" className="cursor-link" onClick={handleEdit}>
              编辑
            </SamLink>
          )}
      </p>
      <section className="clue-detail__panel__base">
        <div className="avatar">
          <ImgWrap width="70px" height="70px" src={avatar || defaultAvatar} />
          {sexIconType !== '' && (
            <p className="sex">
              <EbizIcon type={sexIconType} color="transparent" size="20px" />
            </p>
          )}
        </div>
        <p className="phone">
          {telephone.replace(/(?=(\d{4})+$)/g, '-')}
        </p>
        <p className="name">
          <span>{name}</span>
        </p>
      </section>

      {filtedAttributes.length > 0 && (
        <>
          <hr color="#EBEDF0" />
          <BlockLoading loading={studentLoading}>
            <section className="clue-detail__panel__detail">
              {filtedAttributes.map(attr => {
                const attrItems = attr.attrItem || undefined;
                return (
                  <dl key={attr.attributeId}>
                    <dt>{attr.attributeTitle || '-'}</dt>
                    <dd>{getAttributeValue(attr.attributeValue, attr.dataType, attrItems) || '-'}</dd>
                  </dl>
                );
              })}
            </section>
          </BlockLoading>
          {
            source && (
              <>
                <hr color="#EBEDF0" />
                <section className="clue-detail__panel__source">
                  <ActiveDetail data={source} />
                </section>
              </>
            )
          }
        </>
      )}
      <hr color="#EBEDF0" />
      <section className="clue-detail__panel__revisit">
        {
          !!revisitTime && (
            <dl>
              <dt>回访时间</dt>
              <dd>
                <p>{format(revisitTime, 'YYYY-MM-DD HH:mm:ss')}</p>
                <div style={{ marginTop: '5px' }}>
                  {revisitTimeTag}
                </div>
              </dd>
            </dl>
          )
        }
        <dl>
          <dt>创建时间</dt>
          <dd>{format(createdAt, 'YYYY-MM-DD HH:mm:ss')}</dd>
        </dl>
        {owners.length > 0 && !isDeleted && (
          <dl>
            <dt>跟进人</dt>
            <dd>{ownersText}</dd>
          </dl>
        )}
      </section>
      <Actions owners={owners} clueId={clueId} />
    </aside>
  );
};

export default DetailPanel;
