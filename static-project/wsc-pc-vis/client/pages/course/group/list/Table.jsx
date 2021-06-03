import React, { useRef, useEffect } from 'react';
import { Dialog, Notify } from 'zent';
import { VisTable } from 'components/vis-list';
import { format } from 'date-fns';
import { Link as SamLink, Button as SamButton } from '@youzan/sam-components';
import { getCourseGroupList, getQrCodeByGroupAlias, deleteGroupById } from '../api';
import * as ENUMS from './constants';
import Promotion from 'components/promotion';
import { isInStoreCondition } from 'fns/chain';
const { openDialog, closeDialog } = Dialog;

/**
 * 通过type获取默认分组信息
 *
 * @param {number} type 类型
 * @return {Object} 分组信息
 */
const selectDefaultGroupByType = type => {
  for (let group of Object.values(ENUMS.DEFAULT_GROUP)) {
    if (type === group.type) {
      return group;
    }
  }
  return null;
};

export default function CourseGroupTable({ searchFlag, searchValue }) {
  const tableRef = useRef(null);
  const openPage = url => {
    window.open(url);
  };

  useEffect(() => {
    if (searchFlag === null) return;
    const { refetchData } = tableRef.current;
    refetchData.refresh();
  }, [searchFlag]);

  const onGroupDelete = groupId => {
    const { refetchData } = tableRef.current;
    openDialog({
      dialogId: 'couseGroupDeleteDialog',
      title: '删除分组',
      children: <span>是否确认删除？</span>,
      footer: (
        <div>
          <SamButton
            outline
            onClick={() => {
              refetchData.loading();
              deleteGroupById(groupId)
                .then(res => {
                  Notify.success('删除成功');
                  closeDialog('couseGroupDeleteDialog');
                  refetchData.refresh();
                  refetchData.cancelLoading();
                })
                .catch(err => {
                  Notify.error(err);
                  closeDialog('couseGroupDeleteDialog');
                  refetchData.cancelLoading();
                });
            }}
          >
            删除
          </SamButton>
          <SamButton
            type="primary"
            onClick={() => {
              closeDialog('couseGroupDeleteDialog');
            }}
          >
            我再想想
          </SamButton>
        </div>
      ),
    });
  };

  const columns = [
    {
      title: '分组名称',
      width: '40%',
      bodyRender: data => {
        const isNormal = data.isDefault === ENUMS.NORMAL_GROUP_TYPE;
        const group = isNormal ? null : selectDefaultGroupByType(data.isDefault);
        return (
          <div>
            <a
              onClick={() =>
                openPage(
                  `https://h5.youzan.com/wscshop/edu/group/${data.alias}?kdtId=${_global.kdtId}`,
                )
              }
            >
              {isNormal ? data.title : group.title}
            </a>
            <br />
            {!isNormal && <span className="page-course-group-list__desc">{group.description}</span>}
          </div>
        );
      },
    },
    {
      title: '课程数',
      bodyRender: data => {
        const isEdit =
          (data.isDefault === ENUMS.NORMAL_GROUP_TYPE ||
          data.isDefault === ENUMS.DEFAULT_GROUP.hidden.type);
        return (
          <span>
            {isEdit ? (
              <a onClick={() => { window.location.href = `/v4/vis/course/group/manage/${data.groupId}`; }}>
                {data.goodsCount}
              </a>
            ) : (
              data.goodsCount
            )}
          </span>
        );
      },
    },
    {
      title: '创建时间',
      bodyRender: data => {
        return <span>{format(data.createdTime, 'YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
    {
      title: '操作',
      textAlign: 'right',
      bodyRender: data => {
        const isNormal = data.isDefault === ENUMS.NORMAL_GROUP_TYPE;
        const isBranch = isInStoreCondition({ supportBranchStore: true });
        return (
          <div className="course-group-operation">
            {
              !isBranch && (
                <>
                  <SamLink
                    name="编辑"
                    onClick={() =>
                      openPage(
                        `/v4/vis/course/group/edit/${
                          data.groupId
                        }`,
                      )
                    }
                  />
                  <div className="course-group-divider" />
                </>
              )
            }
            <Promotion
              data={{
                url: `https://h5.youzan.com/wscshop/edu/group/${data.alias}?kdtId=${_global.kdtId}`,
                qrcode: data.qrcode,
                alias: data.alias,
                name: data.title,
                getQrcode: () => getQrCodeByGroupAlias(data.alias),
                pagepath: '',
                hideBdapp: true,
              }}
              hideWeapp={true}
            >
              <SamLink name="推广" />
            </Promotion>
            {isNormal && !isBranch && (
              <>
                <div className="course-group-divider" />
                <SamLink name="删除" onClick={() => onGroupDelete(data.groupId)} />
              </>
            )}
          </div>
        );
      },
    },
  ];

  const fetchData = ({ filterConditions, pageConditions }) => {
    return getCourseGroupList({
      pageNumber: pageConditions.pageNumber,
      pageSize: pageConditions.pageSize,
      sort: pageConditions.sort,
      keyword: searchValue,
      type: 1,
    }).then(res => {
      return {
        datasets: res.content,
        total: res.total,
        current: res.pageable.pageNumber,
      };
    });
  };

  return (
    <div>
      <VisTable
        ref={tableRef}
        columns={columns}
        fetchData={fetchData}
        initQueries={{ sortBy: 'createdTime' }}
        rowKey="groupIdinteger"
      />
    </div>
  );
}
