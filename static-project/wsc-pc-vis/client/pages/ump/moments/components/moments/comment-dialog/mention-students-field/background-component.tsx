import React, { FC, useMemo, useRef, useCallback } from 'react';
import { Tag, Button, Notify } from 'zent';
import { Form } from '@zent/compat';
import { BlankLink } from '@youzan/react-components';
import { isEduHqStore } from '@youzan/utils-shop';
import { CustomSelector as openStudentSelect } from '@youzan/ebiz-components';
import { IDialogOptions, IDialogProps } from '@youzan/ebiz-components/es/types/custom-selector';
import { findStudentPageWithCustomer } from '../../api';

const { getControlGroup } = Form;

interface IStudentsInfo {
  userId: number;
  userRole?: number;
  userName?: string;
  queryData?: any;
}
export interface BackgroundMentionedFieldProps {
  type: number;
  value?: IStudentsInfo[];
  defaultValue?: IStudentsInfo[];
  queryData: any;
  isEdit: boolean;
  onChange?: (data) => void;
}

const Footer: FC<IDialogProps> = ({ table = {}, cancel, submit }) => {
  const { selectedRows = {} } = table;
  const selectedCount = selectedRows.length || 0;
  return (
    <div className="student-dialog-footer">
      <div className="student-dialog-footer__selected">
        <span>
          已选 {selectedCount} 项
        </span>
      </div>
      <div>
        <Button onClick={cancel}>
          取消
        </Button>
        <Button type="primary" onClick={() => {
          if (selectedCount > 100) {
            Notify.error('最多选择100个学员');
            return;
          }
          submit && submit();
        }}>
          确定
        </Button>
      </div>
    </div>
  );
};

const BackgroundMentionedField: FC<BackgroundMentionedFieldProps> = props => {
  const {
    value = [],
    onChange = () => {},
    isEdit
  } = props;

  const lastQueryKeyword = useRef('');

  const deleteStudent = useCallback((id) => {
    onChange(value.filter(it => it.userId !== id));
  }, [onChange, value]);

  const studentSelectOption = useMemo<IDialogOptions>(() => ({
    title: '学员选择',
    async onSubmit(data) {
      onChange(
        data.map(item => {
          return {
            userRole: 1,
            userName: item.userName || '',
            userId: item.userId
          };
        })
      );
    },
    onFetch: (data) => {
      const keyword = data.header.userName || '';
      let pageNumber = data.table.current || 1;

      if (lastQueryKeyword.current !== keyword) {
        pageNumber = 1;
        lastQueryKeyword.current = keyword;
      }

      return findStudentPageWithCustomer({
        query: {
          keyword
        },
        pageRequest: {
          pageSize: 7,
          pageNumber
        }
      }).then(({ pageable, total, content }) => ({
        current: pageable.pageNumber,
        pageSize: pageable.pageSize,
        totalItem: total,
        datasets: content.map(({ student = {} as any, customer = {} as any }) => ({
          userName: student.name,
          userId: student.userId,
          mobile: student.mobile,
          parentName: customer.name,
          parentId: customer.userId,
          lastClassTime: student.lastClassTime
        }))
      }));
    },
    ext: {},
    header: {
      component: <></>,
      children: [
        {
          name: 'userName',
          type: 'Search',
          textAlign: 'right',
          placeholder: '学员姓名'
        }
      ]
    },
    footer: {
      // @ts-ignore custom-selector组件使用了cloneElement传递props
      component: <Footer />
    },
    table: {
      rowKey: 'userId',
      selectedRows: value,
      selection: {
        isSingleSelection: false,
        needCrossPage: true
      },
      columns: [
        {
          title: '学员',
          name: 'userName',
          bodyRender(data) {
            return (
              <BlankLink
                href={`${_global.url.v4}/vis/edu/page/student#/detail/${data.userId}`}
                className="schedule-detail_list-name"
              >
                {data.userName}
              </BlankLink>
            );
          }
        },
        {
          title: '手机号',
          name: 'mobile'
        },
        {
          title: '所属客户',
          name: 'parentName',
          bodyRender(data) {
            return (
              <BlankLink
                href={`${_global.url.v4}/scrm/customer/manage#/detail?yzUid=${data.parentId}`}
                className="schedule-detail_list-name"
              >
                {data.parentName}
              </BlankLink>
            );
          }
        },
        {
          title: '上次上课时间',
          name: 'lastClassTime'
        }
      ]
    }
  }), [value, onChange]);

  const editable = !isEdit && !isEduHqStore;
  return <>
    <a
      onClick={() => editable && openStudentSelect(studentSelectOption)}
      style={{ lineHeight: '30px' }}
      className={editable ? '' : 'select-disabled-link'}
    >
        选择学员
    </a>
    <div>
      {value.map(it => (
        <Tag
          key={it.userId}
          onClose={() => deleteStudent(it.userId)}
          theme="grey"
          outline
          closable={editable}
          style={{ margin: '1px 2px' }}
        >
          {it.userName}
        </Tag>
      ))}
    </div>
  </>;
};

export default getControlGroup(BackgroundMentionedField);
