import { Select } from '@zent/compat';
import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'zent';
// import { VisTable } from 'components/vis-list';
import SearchInput from 'components/search-input/index';
import { Img, EasyList } from '@youzan/ebiz-components';
import { COURSE_TYPE, SELL_STATUS } from '../../constants';
import { isAudioContent, isVideoContent } from '../../../../common/helper';
import { getCourseList } from '../../../api';
import { isInStoreCondition } from 'fns/chain';
import { useArthurDecorator, useArthurModel } from '@youzan/arthur-scheduler-react';

const { ImgLockWrap } = Img;
const { Option } = Select;
const isYZEdu = (window._global && window._global.isYZEdu) || false;
const isEduChainStore = isInStoreCondition({ supportEduChainStore: true });
const { List, EasyGrid } = EasyList;

let selected = [];
let dataset = [];

export default function CourseTable({ onSelect }) {
  const tableRef = useRef(null);
  const [searchValue, setSearchValue] = useState('');
  const [courseType, setCourseType] = useState(-1);
  const {
    model: offlineCourseModel,
  } = useArthurModel('offlineCourseManage.courseGroupFilter', 'course');
  const abilityResult = useArthurDecorator({
    model: offlineCourseModel
  }) || {};

  useEffect(() => {
    refreshList();
    return () => {
      selected = [];
      dataset = [];
    };
  }, [courseType]);
  const fetchData = ({ pageSize = 20, page = 1 }) => {
    let params = {
      pageNumber: page,
      pageSize: pageSize,
      title: searchValue,
    };
    courseType !== -1 && (params.type = courseType);
    return getCourseList(params).then(res => {
      let content = res.content;
      if (!isYZEdu) {
        content = res.content.filter(item => item.type !== COURSE_TYPE.COURSE);
      }
      dataset = content;
      return {
        dataset: content,
        pageInfo: { page: res.pageable.pageNumber, pageSize, total: res.total },
      };
    });
  };
  const refreshList = () => {
    if (tableRef.current) {
      tableRef.current.action.refresh();
    }
  };
  const handleSearch = () => {
    refreshList();
  };
  const columns = [
    {
      title: '课程名称',
      width: '40%',
      bodyRender: data => {
        return (
          <div className="grad-with-img grad-img-16-9">
            <div className="img-box">
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
          case COURSE_TYPE.COURSE:
            type = '线下课';
            break;
          case COURSE_TYPE.COLUMN:
            type = '专栏';
            break;
          case COURSE_TYPE.LIVE:
            type = !isEduChainStore ? '直播' : '';
            break;
          case COURSE_TYPE.CONTENT:
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
          case SELL_STATUS.SELLING:
            status = '出售中';
            break;
          case SELL_STATUS.SELLEDOUT:
            status = '已售罄';
            break;
          case SELL_STATUS.SELLEDSTOP:
            status = '已停售';
            break;
        }
        return <span>{status}</span>;
      },
    },
    {
      title: '已加入分组',
      width: '30%',
      bodyRender: data => {
        const groupText = data.groups.map(item => item.title).join(',');
        return (
          <span className="ellipsis-2" title={groupText}>
            {groupText}
          </span>
        );
      },
    },
  ];

  const options = [{
    value: -1,
    text: '全部类型',
    display: true,
  }, {
    value: COURSE_TYPE.COURSE,
    text: '线下课',
    display: isYZEdu && !!abilityResult.available,
  }, {
    value: COURSE_TYPE.COLUMN,
    text: '专栏',
    display: true,
  }, {
    value: COURSE_TYPE.CONTENT,
    text: '内容',
    display: true,
  }, {
    value: COURSE_TYPE.LIVE,
    text: '直播',
    display: !isEduChainStore,
  }].filter(item => item.display);
  const handleSelect = (selectedRowKeys, changedRow, modifyRow) => {
    let result = [];
    if (selectedRowKeys.length === 0) {
      // 全部取消
      if (Array.isArray(changedRow) && changedRow.length === 0) {
        const allKeys = dataset.map((item) => item.itemId);
        result = selected.filter((item) => !allKeys.includes(item.itemId));
        // 单个取消
      } else if (changedRow !== null) {
        result = selected.filter((item) => item.itemId !== changedRow.itemId);
      }
    } else {
      if (Array.isArray(modifyRow)) { // 批量添加
        const modifyFilterRow = modifyRow.filter(item => !selected.includes(item.itemId));
        result = [...selected, ...modifyFilterRow];
      } else if (selectedRowKeys.includes(modifyRow.itemId)) { // 添加
        result = [...selected, modifyRow];
      } else { // 消除
        result = selected.filter(item => item.itemId !== modifyRow.itemId);
      }
    }
    selected = result;
    onSelect(result);
    return true;
  };

  return (
    <div className="page-course-group-list__course">
      <div className="page-course-group-list__course__header clearfix">
        <div className="page-course-group-list__course__header__left">
          <Button onClick={refreshList}>刷新</Button>
        </div>
        <div className="page-course-group-list__course__header__right">
          <Select
            value={courseType}
            onChange={e => {
              setSearchValue('');
              setCourseType(e.target.value);
            }}
          >
            {options.map(item => <Option key={item.text} value={item.value}>{item.text}</Option>)}
          </Select>
          <SearchInput
            className="page-course-group-list__course__search"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onPressEnter={handleSearch}
            placeholder="搜索"
          />
        </div>
      </div>
      <div className="page-course-group-list__course__cont">
        <List
          ref={tableRef}
          mode='none'
          onSubmit={fetchData}
        >
          <EasyGrid
            selection={{
              onSelect: handleSelect
            }}
            columns={columns}
            rowKey="itemId"
            batchRender={() => (
              <span key="pure" style={{ fontSize: '12px' }}>
                当前页全选
              </span>
            )}
          />
        </List>
      </div>
    </div>
  );
}
