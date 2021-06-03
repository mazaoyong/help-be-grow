import { Pop } from '@zent/compat';
import React, { useState, useEffect, useMemo } from 'react';
import { Dialog } from '@youzan/ebiz-components';
import {
  Button,
  Notify,
  Grid,
  IGridColumn,
  Radio,
  RadioGroup,
  IRadioEvent,
  Sweetalert,
  IGridOnChangeConfig,
} from 'zent';
import { DialogWrapper } from '@ability-center/common';
import { getStudentDetailUrl } from '@ability-center/student';
import { confirmClueMerge } from '../../../../api';
import './styles.scss';

const { DialogFooter } = Dialog;

type TRelatedMembers = {
  name: string;
  userId: number;
};

interface IStudentInfo {
  relatedMembers: TRelatedMembers[];
  identityNo: string;
  mobile: string;
  name: string;
  ownerUserId: number;
  ownerName: string;
  userId: number;
}

export interface IMergeInfoProps {
  identityNo: string;
  ownerId?: number;
  ownerName?: string;
  close: () => void;
  data: IStudentInfo[];
}

const clsNamePrefix = 'merge-student-info';
const pageSize = 5;
function MergeInfo(props: IMergeInfoProps) {
  const [selectedNo, setSelectedNo] = useState('');
  const [page, setPage] = useState(1);
  const [datasets, setDatasets] = useState<IStudentInfo[]>([]);
  const { close, identityNo, data, ownerId, ownerName } = props;
  const length = data.length;
  const multi = length > 1;

  useEffect(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    setDatasets(data.slice(start, end));
  }, [data, page]);

  const columns = useMemo<IGridColumn<IStudentInfo>[]>(() => {
    return [
      {
        title: '学员姓名',
        width: 200,
        bodyRender: rowData => {
          const linkName = (
            <a
              href={getStudentDetailUrl({ studentId: rowData.userId })}
              target="_blank"
              rel="noopener noreferrer"
            >
              {rowData.name}
            </a>
          );
          if (multi) {
            return <Radio key={rowData.identityNo} value={rowData.identityNo}>{linkName}</Radio>;
          }
          return linkName;
        }
      },
      {
        title: '联系人手机',
        name: 'mobile'
      },
      {
        title: '家庭帐号',
        textAlign: 'right',
        bodyRender: rowData => {
          const len = rowData.relatedMembers.length;
          const singleName = (name: string, userId: number, synax: boolean) => (
            <span key={userId}>
              <a
                href={`${_global.url.v4}/scrm/customer/manage#/detail?yzUid=${userId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {name}
              </a>
              {synax && '、'}
            </span>
          );
          const MultiNames = () => {
            return (
              <>
                {rowData.relatedMembers.map(({ name, userId }, i) =>
                  singleName(name, userId, i !== len - 1)
                )}
              </>
            );
          };

          return (
            <Pop
              trigger="hover"
              key={rowData.identityNo}
              content={
                <span>
                  <MultiNames />
                </span>
              }
            >
              <div className={`${clsNamePrefix}__text`}>
                <MultiNames />
              </div>
            </Pop>
          );
        }
      }
    ];
  }, [multi]);

  const onChange = (e: IRadioEvent<string>) => {
    const val = e.target.value;
    setSelectedNo(val || '');
  };

  const confirmMerge = (selectedUserId, selectedIdentityNo: string, ownerUserId?: number) => {
    const params: any = {
      identityNo,
      targetIdentityNo: selectedIdentityNo
    };
    if (ownerUserId) {
      params.ownerUserId = ownerUserId;
    }
    confirmClueMerge(params)
      .then(() => {
        Notify.success('合并成功');
        location.href = `${_global.url.v4}/vis/edu/page/student#/detail/${selectedUserId}`;
        close();
      })
      .catch(() => {
        Notify.error('合并失败');
      });
  };

  const onSubmit = () => {
    let selectedOwnerUserId = data[0].ownerUserId;
    let selectedIdentityNo = data[0].identityNo;
    let selectedUserId = data[0].userId;
    let selectedOwnerName = data[0].ownerName;
    if (multi) {
      const selectedInfo = data.find(item => item.identityNo === selectedNo);
      if (!selectedInfo) {
        Notify.error('请先选择学员');
        return;
      }
      selectedOwnerUserId = selectedInfo.ownerUserId;
      selectedIdentityNo = selectedNo;
      selectedUserId = selectedInfo.userId;
      selectedOwnerName = selectedInfo.ownerName;
    }

    if (ownerId && selectedOwnerUserId && ownerId !== selectedOwnerUserId) {
      Sweetalert.confirm({
        title: '提示',
        content: `当前线索的课程顾问是 ${ownerName}，学员的课程顾问是 ${selectedOwnerName}，是否需要将学员的课程顾问更新为 ${ownerName}？`,
        confirmText: '更新',
        cancelText: '无需更新',
        maskClosable: true,
        onConfirm: () => confirmMerge(selectedUserId, selectedIdentityNo, ownerId),
        onCancel: () => confirmMerge(selectedUserId, selectedIdentityNo)
      });
      return;
    }
    Sweetalert.confirm({
      title: '提示',
      content: '转为学员后，你可以在学员管理模块中查看当前学员，是否确认现在转为学员？',
      onConfirm: () => confirmMerge(selectedUserId, selectedIdentityNo, ownerId)
    });
  };

  const onGridChange = (conf: IGridOnChangeConfig) => {
    setPage(conf.current || 1);
  };

  return (
    <div className={`${clsNamePrefix}`}>
      <div className={`${clsNamePrefix}__content`}>
        <div className={`${clsNamePrefix}__desc`}>
          店铺中已存在<span style={{ color: '#323233', fontWeight: 'bold' }}>{length}</span>个姓名和手机号相同的学员，{multi && '请选择一个合并。'}
          合并后，学员基本信息将以原学员的资料为准，同时将线索中的课程顾问、来源、动态记录、标签信息合并到学员中。
        </div>
        <RadioGroup value={selectedNo} onChange={onChange}>
          <Grid
            columns={columns}
            datasets={datasets}
            paginationType="lite"
            onChange={onGridChange}
            pageInfo={multi ? { pageSize: pageSize, current: page, total: length } : undefined}
          />
        </RadioGroup>
      </div>
      <DialogFooter>
        <Button onClick={() => close()}>取消</Button>
        <Button type="primary" onClick={onSubmit}>
          合并
        </Button>
      </DialogFooter>
    </div>
  );
}
export default DialogWrapper(MergeInfo, { style: { width: '600px' } });
