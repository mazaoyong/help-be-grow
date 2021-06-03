import React, { useMemo } from 'react';
import { format, differenceInCalendarDays, isSameDay } from 'date-fns';
import { Tag } from 'zent';
import { ShowWrapper } from 'fns/chain';
import { isEduHqStore } from '@youzan/utils-shop';
import { StudentDetailLink } from '@ability-center/student';
import './style.scss';

interface IOwner {
  name: string;
  userId: number;
}

export interface IOtherStudentInfoProps {
  phase: number;
  revisitTime?: number | string;
  createdAt?: number | string;
  ownerSchoolName?: string;
  owners?: IOwner[];
  introducer?: {
    name: string;
    relationType: number;
    userId: number;
  } | null;
}

export default function(props: IOtherStudentInfoProps) {
  const { revisitTime, createdAt, ownerSchoolName, owners, phase, introducer } = props;
  const isDeleted = useMemo(() => phase === 8, [phase]);
  const revisitTimeTag = useMemo(() => {
    if (!revisitTime) return null;
    const differentday = differenceInCalendarDays(revisitTime, new Date());

    if (isSameDay(revisitTime, new Date())) {
      return (
        <Tag theme="red" outline>
          今天
        </Tag>
      );
    }

    if (differentday < 0) {
      return (
        <Tag theme="red" outline>
          已逾期
        </Tag>
      );
    }
    if (differentday < 1) {
      return (
        <Tag theme="red" outline>
          今天
        </Tag>
      );
    } else if (differentday < 2) {
      return (
        <Tag theme="green" outline>
          距今{differentday}天
        </Tag>
      );
    } else {
      return (
        <Tag theme="green" outline>
          距今{differentday}天
        </Tag>
      );
    }
  }, [revisitTime]);

  const showRevisitTime = !!revisitTime;
  const showCreatedAt = !!createdAt;
  const showOwnerSchoolName = Boolean(ownerSchoolName && isEduHqStore);
  const showOwner = Boolean(owners && owners.length > 0 && owners[0].name && !isDeleted);

  return (
    <section className="other-student-info">
      {showRevisitTime && (
        <dl>
          <dt>回访时间</dt>
          <dd>
            <p>{format(revisitTime as number, 'YYYY-MM-DD HH:mm:ss')}</p>
            <div style={{ marginTop: '5px' }}>{revisitTimeTag}</div>
          </dd>
        </dl>
      )}
      {showCreatedAt && (
        <dl>
          <dt>创建时间</dt>
          <dd>{format(createdAt as number, 'YYYY-MM-DD HH:mm:ss')}</dd>
        </dl>
      )}
      {(showRevisitTime || showCreatedAt) && (showOwnerSchoolName || showOwner) && <hr color="#EBEDF0" />}
      {showOwnerSchoolName && (
        <ShowWrapper isInStoreCondition={isEduHqStore}>
          <dl>
            <dt>所属校区</dt>
            <dd>{ownerSchoolName || '-'}</dd>
          </dl>
        </ShowWrapper>
      )}
      {showOwner && (
        <dl>
          <dt>课程顾问</dt>
          <dd>{(owners as any[])[0].name}</dd>
        </dl>
      )}
      {introducer &&
        <dl>
          <dt>介绍人</dt>
          <dd>
            {introducer.userId
              ? <StudentDetailLink studentId={introducer.userId}>{introducer.name || '-'}</StudentDetailLink>
              : '-'}
          </dd>
        </dl>
      }
    </section>
  );
}
