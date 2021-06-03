import { Form } from '@zent/compat';
import React, { FC, useCallback, useState } from 'react';
import { Notify } from 'zent';
import { Select } from '@youzan/ebiz-components';
import { findStudentsOnLesson } from '../../api';
import { IPageRequest } from '@youzan/ebiz-components/es/types/select';

const { getControlGroup } = Form;

interface IStudentsInfo {
  userId: number;
  userRole?: number;
  userName?: string;
  queryData?: any;
}
export interface IMentionedParams {
  type: number;
  value?: IStudentsInfo[];
  defaultValue?: IStudentsInfo[];
  isBackground?: boolean;
  queryData: any;
  isEdit: boolean;
  onChange?: (data) => void;
}

const MentionedField: FC<IMentionedParams> = props => {
  const {
    type,
    value = [],
    onChange = () => {},
    defaultValue = [],
    queryData = {},
    isEdit,
  } = props;

  const onSelect = useCallback((_, items) => {
    onChange(
      items.map(item => {
        return {
          userRole: item.userRole || 1,
          userName: item.text || '',
          userId: item.value,
        };
      }),
    );
  }, []);

  const fetchOptions: (name: string, pageRequest: IPageRequest) => Promise<any> = (
    name,
    pageRequest,
  ) => {
    return findStudentsOnLesson({
      query: {
        name: name || '',
        lessonNo: queryData.lessonNo || '',
        kdtId: queryData.kdtId || _global.kdtId,
      },
      pageRequest: {
        pageNumber: pageRequest.current,
        pageSize: pageRequest.pageSize,
      },
    })
      .then(resp => {
        if (resp && resp.content) {
          return {
            options: resp.content.map(item => ({
              text: item.studentName,
              value: item.studentId,
            })),
            pageInfo: {
              current: pageRequest.current,
              total: resp.total,
            },
          };
        }
      })
      .catch(err => {
        Notify.error(err);
      });
  };

  const MultiStudent: FC<{ values: IStudentsInfo[] }> = props => {
    const { values } = props;
    const [activeMore, setActiveMore] = useState<boolean>(false);
    if (values.length > 20 && !activeMore) {
      return (
        <div style={{ lineHeight: '30px' }}>
          {values.slice(0, 20).map((item, index) => {
            return (
              <span key={`user${item.userId}`}>
                {item.userName}
                {index < values.length - 1 ? '，' : '...'}
              </span>
            );
          })}
          <span onClick={() => setActiveMore(true)}>更多</span>
        </div>
      );
    } else {
      return (
        <div style={{ lineHeight: '30px', wordBreak: 'break-all' }}>
          {values.map((item, index) => {
            return (
              <span key={`user${item.userId}`}>
                {item.userName}
                {index < values.length - 1 ? '，' : ''}
              </span>
            );
          })}
        </div>
      );
    }
  };

  return type === 1 && !isEdit && defaultValue.length > 1 ? (
    <Select
      tags
      width="400px"
      value={defaultValue.map(item => item.userId)}
      defaultOptions={defaultValue.map(item => {
        return {
          text: item.userName || '',
          value: item.userId || undefined,
        };
      })}
      onSelect={onSelect}
      mode="async"
      fetchOnMounted
      fetchOptions={fetchOptions}
    />
  ) : (
    <>
      {value.length > 1 ? (
        <MultiStudent values={value} />
      ) : (
        <span style={{ lineHeight: '30px' }}>{value.length ? value[0].userName : ''}</span>
      )}
    </>
  );
};

export default getControlGroup(MentionedField);
