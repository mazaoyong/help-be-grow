import React, { useState, useRef } from 'react';
import { Dialog, Notify, Sweetalert } from 'zent';
import { VisTable } from 'components/vis-list';
import SearchInput from 'components/search-input/index';
import { Img } from '@youzan/ebiz-components';
import { Link as SamLink, Button as SamButton } from '@youzan/sam-components';
import { getCourseByGroupId, addCourseToGroup, removeCourseFromGroup } from '../api';
import { format } from 'date-fns';
import classnames from 'classnames';
import * as ENUMS from './constants';
import CourseTable from './components/dialog/CourseTable';
import Footer from './components/dialog/Footer';
import { isAudioContent, isVideoContent } from '../../common/helper';
import { isInStoreCondition } from 'fns/chain';
const { ImgLockWrap } = Img;

export default function ManagePage() {
  const groupId = parseInt(_global.groupId);
  const [searchValue, setSearchValue] = useState('');
  const [dialogSelectedInfo, setDialogSelectedInfo] = useState([]);
  const [dialogShow, setDialogShow] = useState(false);
  const [listSelectedInfo, setListSelectedInfo] = useState([]);
  const tableRef = useRef(null);

  const isBranch = isInStoreCondition({ supportBranchStore: true });

  const handleSelected = (selectedRows, datasets) => {
    setListSelectedInfo([...selectedRows]);
  };
  const refreshList = () => {
    const { refetchData } = tableRef.current;
    refetchData.refresh();
  };
  /**
   * 显示批量移除操作失败提示
   *
   * @param {*} res 返回对象
   */
  const showRemoveFailedTip = res => {
    if (res.failCount != null && res.failCount > 0) {
      Sweetalert.alert({
        content: `有${res.failCount}个课程商品移除失败，请重试`,
        closeBtn: true,
        maskClosable: true,
      });
    }
  };
  /**
   * 显示批量添加操作失败提示
   *
   * @param {*} res 返回对象
   */
  const showSucceedFailedTip = res => {
    if (res.failCount != null && res.failCount > 0) {
      Sweetalert.alert({
        content: `有${res.failCount}个课程商品添加失败，请重试`,
        closeBtn: true,
        maskClosable: true,
      });
    }
  };
  const handleSearch = () => {
    refreshList();
  };
  const fetchData = ({ filterConditions, pageConditions }) => {
    return getCourseByGroupId({
      pageNumber: pageConditions.pageNumber,
      pageSize: pageConditions.pageSize,
      groupId,
      keyword: searchValue,
    }).then(res => {
      return {
        datasets: res.content,
        total: res.total,
        current: res.pageable.pageNumber,
      };
    });
  };
  const onRemove = itemId => {
    const { refetchData } = tableRef.current;
    if (!itemId && listSelectedInfo.length === 0) {
      Notify.error('请先选择课程');
      return;
    }
    removeCourseFromGroup({
      groupId,
      itemIds: itemId ? [itemId] : listSelectedInfo.map(item => item.itemId),
    })
      .then(res => {
        showRemoveFailedTip(res);
        refetchData.cancelLoading();
        refreshList();
      })
      .catch(err => {
        refetchData.cancelLoading();
        Notify.error(err);
      });
  };
  const handleCourseSelected = (selectedRows, datasets) => {
    setDialogSelectedInfo([...selectedRows]);
  };
  const addCourse = () => {
    if (dialogSelectedInfo.length > 0) {
      addCourseToGroup({
        groupId,
        itemIds: dialogSelectedInfo.map(item => item.itemId),
      })
        .then(res => {
          showSucceedFailedTip(res);
          refreshList();
          setDialogShow(false);
          setDialogSelectedInfo([]);
        })
        .catch(() => {
          Notify.error('添加失败');
        });
    } else {
      Notify.error('请先选择一个课程');
    }
  };
  const columns = [
    {
      title: '课程名称',
      width: '30%',
      bodyRender: data => {
        const imgWrapCls = classnames({
          'img-box': true,
        });
        return (
          <div className="grad-with-img grad-img-16-9">
            <div className={imgWrapCls}>
              <ImgLockWrap
                width="106px"
                height="60px"
                src={data.imageUrl}
                fullfill="!100x100.jpg"
              />
            </div>
            <div className="content-box">
              <p>
                <a
                  className="name ellipsis-2"
                  href={data.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {data.title}
                </a>
              </p>
              {
                !(data.sellerType && data.sellerType === 2) && (
                  <div className="price-wrap">
                    {data.price != null ? <p className="price">¥ {(data.price / 100).toFixed(2)}</p> : null}
                  </div>
                )
              }
            </div>
          </div>
        );
      },
    },
    {
      title: '课程类型',
      bodyRender: data => {
        let type = '';
        switch (data.type) {
          case ENUMS.COURSE_TYPE.COURSE:
            type = '线下课';
            break;
          case ENUMS.COURSE_TYPE.COLUMN:
            type = '专栏';
            break;
          case ENUMS.COURSE_TYPE.LIVE:
            type = '直播';
            break;
          case ENUMS.COURSE_TYPE.CONTENT:
            if (isAudioContent(data)) {
              type = '音频';
            } else if (isVideoContent(data)) {
              type = '视频';
            } else {
              type = '图文';
            }
            break;
        }
        return <span>{type}</span>;
      },
    },
    {
      title: '出售状态',
      bodyRender: data => {
        let status = '';
        switch (data.sellStatus) {
          case ENUMS.SELL_STATUS.SELLING:
            status = '出售中';
            break;
          case ENUMS.SELL_STATUS.SELLEDOUT:
            status = '已售罄';
            break;
          case ENUMS.SELL_STATUS.SELLEDSTOP:
            status = '已停售';
            break;
        }
        return <span>{status}</span>;
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
      bodyRender: data => {
        return (
          <div className="course-group-operation">
            {
              !isBranch && <SamLink name="移除" onClick={() => onRemove(data.itemId)} />
            }
          </div>
        );
      },
    },
  ];

  return (
    <div className="page-course-group-list">
      <div className="page-course-group-list__header clearfix">
        {
          !isBranch && (
            <SamButton type="primary" onClick={() => setDialogShow(true)}>
              选择课程
            </SamButton>
          )
        }
        <SearchInput
          className="page-course-group-list__search"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          onPressEnter={handleSearch}
          placeholder="搜索"
        />
      </div>
      <VisTable
        ref={tableRef}
        columns={columns}
        fetchData={fetchData}
        onChange={() => setListSelectedInfo([])}
        selectable={!isBranch}
        onSelect={handleSelected}
        initQueries={{ sortBy: 'createdTime' }}
        rowKey="itemId"
        batchComponents={!isBranch ? [
          <span key="pure">当前页全选</span>,
          data => {
            return (
              <SamButton key="func" onClick={() => onRemove()}>
                移除
              </SamButton>
            );
          },
        ] : []}
      />
      <Dialog
        title="选择课程"
        footer={
          <Footer
            onCancel={() => setDialogShow(false)}
            onOk={addCourse}
            selectedInfo={dialogSelectedInfo}
          />
        }
        className="dialog-course-table"
        visible={dialogShow}
        onClose={() => setDialogShow(false)}
      >
        <CourseTable onSelect={handleCourseSelected} />
      </Dialog>
    </div>
  );
}
