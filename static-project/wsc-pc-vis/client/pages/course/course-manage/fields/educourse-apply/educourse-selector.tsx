import { Pop } from '@zent/compat';
import React, { useRef } from 'react';
import { Button, Input, Notify } from 'zent';
import SchoolChooser from '@ability-center/shop/school-selector';
import { ValuntaryAsyncSelect } from 'components/valuntary-async-select/ValuntaryAsyncSelect';
import { getCourseList } from '../../../api/educourse';
import { findPageAllCampus } from '../../../api/shop';
import { findEduClassByCondition } from '../../../api/course-manage';
import { assign, has } from 'lodash';
import getEduCourseDetail from '../../common/transfer-educourse-detail';
import { ShowWrapper, isInStoreCondition, arrayColumnWrapper } from 'fns/chain';

export default function EducourseSelector(props) {
  const isShopSelected = useRef(false);
  const [openDialog, SchoolDialog] = SchoolChooser({
    componentConfig: {
      Filter: <Filter />,
      Foot: <Foot />,
      fetch: ({ filterConditions, pageConditions }) => {
        const { currentSelect = null, searchValue = '' } = filterConditions;
        return getCourseList({
          pageNumber: pageConditions.current || 1,
          pageSize: pageConditions.pageSize,
          kdtId: currentSelect || null,
          name: searchValue,
          isTrial: 0,
        }).then(resp => {
          if (filterConditions.currentSelect && !isShopSelected.current) {
            isShopSelected.current = true;
          } else if (!filterConditions.currentSelect && isShopSelected.current) {
            isShopSelected.current = false;
          }
          return resp;
        });
      },
      isSingleSelection: true,
      hasSelect: true,
      rowKey: 'alias',
      getRowConf: data => {
        return {
          canSelect: !(!data.classNum && props.courseSellType === 3),
        };
      },
      columns: arrayColumnWrapper([
        {
          title: '课程名称',
          name: 'name',
          bodyRender: data => {
            return <span>{data.name}</span>;
          },
        },
        {
          title: '适用年龄',
          bodyRender: data => {
            return <span>{getAgeRange(data.minApply, data.maxApply, data.applyType)}</span>;
          },
        },
        {
          title: '上课校区',
          bodyRender: ({ applicableCampusType, applicableCampusList }) => {
            return (
              <>
                {applicableCampusType ? (
                  <span>全部校区</span>
                ) : isShopSelected.current ? (
                  <span>—</span>
                ) : (
                  <Pop
                    trigger="hover"
                    block
                    content={applicableCampusList.map(item => item.shopName).join('；')}
                  >
                    <span>
                      <span style={{ color: '#38f' }}>
                        {applicableCampusList ? applicableCampusList.length : 0}
                      </span>
                      个
                    </span>
                  </Pop>
                )}
              </>
            );
          },
          chainState: isInStoreCondition({
            supportEduHqStore: true,
          }),
        },
        {
          title: '开班数',
          bodyRender: data => {
            return <span>{data.classNum}</span>;
          },
        },
      ]),
      emptyLabel: (
        <>
          暂无课程，你可以
          <a
            href={`${_global.url.v4}/vis/edu/page/educourse#/add`}
            target="_blank"
            rel="noopener noreferrer"
          >
            新建课程
          </a>
        </>
      ),
    },
    dialogConfig: {
      title: '选择课程',
      onSubmit: data => {
        if (has(data, 'selectInfo.selectedRows') && data.selectInfo.selectedRows.length) {
          const { id, name } = data.selectInfo.selectedRows[0];
          findEduClassByCondition({
            query: { eduCourseId: id },
            page: {
              pageNumber: 1,
              pageSize: 1000,
            },
          })
            .then(classRelatedInfo => {
              const { value, onChange } = props;
              onChange(
                assign({}, value, {
                  isRelatedEduCourse: true,
                  applyCourseType: 2,
                  eduCourse: {
                    id,
                    name,
                    classRelatedInfo: getEduCourseDetail(classRelatedInfo),
                  },
                }),
              );
            })
            .catch(err => {
              Notify.error(err || '获取课程关联信息失败');
            });
        }
      },
    },
  });
  return (
    <>
      <a href="javascript:;" onClick={openDialog}>
        选择课程
      </a>
      <SchoolDialog />
    </>
  );
}

function Foot(props) {
  return (
    <div style={{ textAlign: 'right' }}>
      <span>
        <Button type="primary" onClick={props.submit}>
          确定
        </Button>
      </span>
    </div>
  );
}

function getAgeRange(minApply, maxApply, applyType) {
  if (maxApply === 10000) {
    if (minApply === 10000) {
      return '—';
    }
    return `${minApply}${applyType === 0 ? '月' : '岁'}以上`;
  } else if (maxApply === minApply) {
    return `${minApply}${applyType === 0 ? '月' : '岁'}`;
  }
  return `${minApply}~${maxApply}${applyType === 0 ? '月' : '岁'}`;
}

function Filter(props) {
  const { fetchData, datasets } = props;
  const { filterInfo, pageInfo } = datasets;

  const onSelectChangeHandler = data => {
    fetchData({
      filterConditions: assign({}, filterInfo, { currentSelect: data }),
      pageConditions: pageInfo,
    });
  };

  const onPressSearch = data => {
    fetchData({
      filterConditions: assign({}, filterInfo, { searchValue: data }),
      pageConditions: pageInfo,
    });
  };
  return (
    <div className="educourse-choose-header">
      <div>
        <Button
          type="primary"
          href={`${_global.url.v4}/vis/edu/page/educourse#/add`}
          target="_blank"
        >
          新建课程
        </Button>
        <Button
          onClick={() => fetchData({ filterConditions: filterInfo, pageConditions: pageInfo })}
        >
          刷新
        </Button>
      </div>
      <div style={{ display: 'flex' }} className="educourse-choose-filter">
        <ShowWrapper
          isInStoreCondition={isInStoreCondition({
            supportEduHqStore: true,
          })}
        >
          <ValuntaryAsyncSelect
            defaultOption={null}
            create={false}
            onSearch={keyword => {
              return { name: keyword };
            }}
            refresh={false}
            onChange={e => onSelectChangeHandler(e.target.value)}
            getOptions={getEduCourseOptions}
            placeholder="上课校区"
            width="165px"
          />
        </ShowWrapper>
        <Input
          icon="search"
          width="150px"
          className="educourse-choose-input"
          placeholder="课程名称"
          onPressEnter={(e: any) => onPressSearch(e.target.value)}
        />
      </div>
    </div>
  );
}

function getEduCourseOptions(query, pageConditions) {
  const { name = null } = query || {};
  return findPageAllCampus({
    shopCampusQuery: { hqKdtId: null, name },
    pageRequest: pageConditions,
  }).then(res => {
    const { content = [] } = res || {};
    const options = content.map(item => {
      return {
        text: item.shopName,
        value: item.kdtId,
      };
    });
    if (pageConditions.pageNumber === 1) {
      options.unshift({ text: '全部', value: '' });
    }

    return options;
  });
}
