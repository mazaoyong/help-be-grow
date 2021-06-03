import { Pop } from '@zent/compat';
import React from 'react';
import { Button, ClampLines, Icon, Tag } from 'zent';
import { CustomSelector as openCustomSelector } from '@youzan/ebiz-components';
// import openCustomSelector from 'components/custom-selector';
import { arrayColumnWrapper, isInStoreCondition } from 'fns/chain';

import { ValuntaryAsyncSelect } from 'components/valuntary-async-select/ValuntaryAsyncSelect';
import SkuSelector from '../sku-selector';

import { formatErrorMsg, formatSkuErrors, computeSkuStr, cent2yuan } from '../../../../util';
import { getCourseList, findOfflineCourseWithCondition, findOfflineCourseWithConditionV2 } from '../../../../api';

const headerChildren = arrayColumnWrapper([
  {
    type: 'Custom',
    component: <CourseAdd />,
    textAlign: 'left',
  },
  {
    type: 'Select',
    name: 'courseType',
    placeholder: '全部线下课类型',
    width: '160px',
    data: [
      {
        text: '全部线下课类型',
        value: '',
      },
      {
        text: '体验课',
        value: 0,
      },
      {
        text: '正式课',
        value: 1,
      },
    ],
    textAlign: 'right',
  },
  {
    type: 'Select',
    name: 'courseSellType',
    width: '160px',
    placeholder: '全部收费方式',
    data: [
      {
        text: '全部收费方式',
        value: '',
      },
      {
        text: '按课时',
        value: 1,
      },
      {
        text: '按时段',
        value: 2,
      },
      {
        text: '按期',
        value: 3,
      },
      {
        text: '自定义',
        value: 0,
      },
    ],
    textAlign: 'right',
    chainState: isInStoreCondition({
      supportEduBranchStore: true,
      supportEduSingleStore: true,
    }),
  },
  {
    type: 'Custom',
    width: '160px',
    textAlign: 'right',
    component: <EduCourseSelect />,
    chainState: isInStoreCondition({
      supportEduBranchStore: true,
      supportEduSingleStore: true,
    }),
  },
  {
    type: 'Search',
    name: 'title',
    width: '160px',
    placeholder: '请输入线下课名称',
    textAlign: 'right',
  },
]);

const extColumns = [
  {
    title: '价格',
    bodyRender: ({ price }) => <span className="edu-enrollment-price-wrapper">{cent2yuan(price)}</span>,
    width: '60px',
  },
  {
    title: '名额',
    bodyRender: ({ stockNum }, skuError) => {
      if (!skuError) {
        return stockNum;
      }
      return (
        <div className="edu-enrollment-pop-content">
          {stockNum}
          <Pop
            trigger="hover"
            position="top-left"
            content={skuError}
          >
            <Icon type="help-circle-o" />
          </Pop>
        </div>
      );
    },
    width: '60px',
  },
];

function CourseAdd({ fetch }) {
  return (
    <div className="edu-enrollment-courses-add">
      <Button onClick={() => {
        window.open('/v4/vis/edu/course#/course-manage/add');
      }}>发布线下课</Button>
      <a href="javascript: void(0);" onClick={fetch}>刷新</a>
    </div>
  );
}

function EduCourseSelect({ change, fetch }) {
  const handleOptionsLoad = (query, pageConditions) => {
    const { name = null } = query || {};
    const params = {
      // 校区设置
      kdtId: window._global.kdtId,
      pageNumber: pageConditions.pageNumber,
      pageSize: pageConditions.pageSize,
      sort: pageConditions.sort,
      name,
    };
    return getCourseList(params).then(
      (res) => {
        const { content = [] } = res || {};
        const options = content.map(item => {
          return {
            text: item.name,
            value: item.id,
          };
        });
        if (pageConditions.pageNumber === 1) {
          options.unshift({ text: '全部适用课程', value: -1 });
        }
        return options;
      },
    );
  };

  const handleChange = e => {
    change({ eduCourseId: e.target.value }).then(fetch);
    return { value: e.target.value };
  };

  return (
    <ValuntaryAsyncSelect
      defaultOption={null}
      create={false}
      onSearch={keyword => {
        return { name: keyword };
      }}
      refresh={false}
      // value={-1}
      onChange={handleChange}
      getOptions={handleOptionsLoad}
      placeholder='全部适用课程'
      width='160px'
    />
  );
}

function DialogFooter({ cancel, submit }) {
  return (
    <div className="edu-enrollment-courses-select">
      <Button onClick={cancel}>取消</Button>
      <Button type="primary" onClick={submit}>确定</Button>
    </div>
  );
}

export default function openCourseSelector({
  studentAggregate,
  studentName,
  onSubmit,
  onClose,
  selectedRows = [], ext = {},
}) {
  openCustomSelector({
    // 额外信息初始化
    ext,
    // 头部筛选
    header: {
      children: headerChildren,
    },

    // 主体列表
    table: {
      columns: [
        {
          title: '线下课名称',
          bodyRender: ({ course, errors }) => (
            <div>
              <a
                className="edu-enrollment-courses-title"
                href={`//h5.youzan.com/wscvis/edu/prod-detail?alias=${course && course.alias}&kdt_id=${window._global.kdtId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ClampLines
                  lines={1}
                  text={course && course.title}
                />
                {
                  course && course.courseType === 0 ? (
                    <Tag outline style={{ color: '#b53f29', borderColor: '#c36058', backgroundColor: '#f9edeb' }}>体验课</Tag>
                  ) : null
                }
              </a>
            </div>
          ),
        },
        {
          title: '课程规格',
          bodyRender: ({ id, productSkuDTOList, course, errors }, { ext, onExtChange, onRowSelect }) => {
            const hasSku = productSkuDTOList && productSkuDTOList.length > 0;
            if (!hasSku) {
              return '-';
            }
            if (errors.allLack || errors.overLimit) {
              return <span className="edu-enrollment-sku-select-grey">选择规格</span>;
            }
            const _skuId = ext && ext[id] && ext[id].skuId;
            const dialogOpen = ext && ext[id] && ext[id].dialogOpen;
            const _sku = productSkuDTOList.find(curSku => curSku.id === _skuId);
            const skuErrors = formatSkuErrors(errors, course, studentName);
            const skuStr = computeSkuStr(_sku);
            return (
              <div className="edu-enrollment-sku-wrapper">
                {skuStr || null}
                <SkuSelector
                  initialValue={_skuId ? [_skuId] : []}
                  data={productSkuDTOList || []}
                  extColumns={extColumns}
                  skuErrors={skuErrors}
                  dialogOpen={dialogOpen || 0}
                  onSelect={skuIds => {
                    onExtChange(ext => {
                      return {
                        ...ext,
                        [id]: { skuId: skuIds[0] },
                      };
                    }, () => {
                      onRowSelect();
                    });
                  }}
                >
                  {skuStr ? <a><Icon type="edit-o" /></a> : <a href="javascript: void(0);">选择规格</a>}
                </SkuSelector>
              </div>
            );
          },
        },
        {
          title: '适用课程',
          bodyRender: ({ course, errors }) => {
            return (
              <ClampLines
                lines={1}
                text={(course && (course.applyCourseType === 1 ? '全部课程' : course.applyCourseName)) || '-'}
              />
            );
          },
        },
        {
          title: '收费方式',
          bodyRender: ({ course }) => {
            if (course.courseType === 0) {
              return '-';
            }
            switch (course && course.courseSellType) {
              case 1:
                return '按课时';
              case 2:
                return '按时段';
              case 3:
                return '按期';
              default:
                return '自定义';
            }
          },
        },
        {
          title: '名额',
          width: '42px',
          bodyRender: ({ course }) => {
            return course && course.totalStock;
          },
        },
        {
          title: '价格',
          textAlign: 'right',
          bodyRender: ({ id, course, productSkuDTOList }, { ext }) => {
            let price = '';
            const _skuId = ext && ext[id] && ext[id].skuId;
            if (_skuId) {
              const _sku = productSkuDTOList.find(curSku => curSku.id === _skuId);
              price = (_sku && _sku.price) || 0;
            } else {
              price = (course && course.price) || 0;
            }
            return (
              <span className="edu-enrollment-courses-price edu-enrollment-price-wrapper">{cent2yuan(price)}</span>
            );
          },
        },
        {
          title: '其他',
          bodyRender: ({ course, errors }) => {
            if (errors.allLack) {
              return (
                <div>
                  课程已售罄
                  <br />
                  <a
                    href={'//www.youzan.com/v4/vis/edu/course#/course-manage/edit/' + course.alias}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    修改课程名额
                  </a>
                </div>
              );
            }
            if (errors.overLimit) {
              return (
                <div>
                  客户已超过购买次数限制（{errors.overLimit}次）
                  <br />
                  <a
                    href={'//www.youzan.com/v4/vis/edu/course#/course-manage/edit/' + course.alias}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    修改限购次数
                  </a>
                </div>
              );
            }
            return '-';
          },
        },
      ],

      rowKey: 'id',

      selectedRows,

      getRowConf: ({ errors }, index) => ({
        canSelect: !(errors.allLack || errors.overLimit),
      }),

      selection: {
        isSingleSelection: false,
        needCrossPage: true,
      },
    },

    // 底部按钮
    footer: {
      component: <DialogFooter />,
    },

    // 弹窗外壳
    title: '选择线下课',
    className: 'edu-enrollment-courses-dialog',

    onClose,
    maskClosable: false,

    onSelect: (selectedData, ext, onExtChange) => {
      // 校验当前数据行是否选择了sku
      return Promise.resolve(selectedData.filter(item => {
        const { id, productSkuDTOList } = item;
        const hasSku = productSkuDTOList && productSkuDTOList.length > 0;
        const _skuId = ext && ext[id] && ext[id].skuId;
        const dialogOpen = ext && ext[id] && ext[id].dialogOpen;
        const _sku = productSkuDTOList.find(curSku => curSku.id === _skuId);
        const skuStr = computeSkuStr(_sku);
        if (hasSku && !skuStr) {
          onExtChange(Object.assign({}, ext, { [id]: { ...ext[id], dialogOpen: ((dialogOpen || 0) + 1) } }));
          return false;
        }
        return true;
      }));
    },

    onFetch: ({ header, table, footer }, params) => {
      const pageRequest = {
        pageNumber: (params && params.reset) ? 1 : table.current,
        pageSize: 10,
      };
      const offineCourseQueryCommand = Object.keys(header)
        .map((key) => {
          const item = header[key];
          if (item === '') {
            return null;
          }
          return { [key]: item };
        }, {})
        .filter(item => item !== null)
        .reduce((obj, item) => Object.assign(obj, item), {});
      offineCourseQueryCommand.studentAggregate = studentAggregate;

      const orderNoRegEx = /orderNo=([^&]*)/.exec(window.location.href);
      const isV2 = orderNoRegEx && orderNoRegEx[1];

      if (isV2) {
        return findOfflineCourseWithConditionV2({
          pageRequest,
          offineCourseQueryCommand,
        }).then(data => {
          const datasets = data.content.map(({ productSkuDTOList, courseBizErrorMsgList, course, spuId }) => {
            const id = course && course.courseProductDTO && course.courseProductDTO.id;

            const formalCourse = course && course.courseProductDTO && course.courseProductDTO.formalCourse;

            const _course = {
              ...course.courseProductDTO,
              validityPeriodType: formalCourse &&
                formalCourse.classHourCourse &&
                formalCourse.classHourCourse.validityPeriodType,
              courseSellType: formalCourse && formalCourse.courseSellType,
              applyCourseType: formalCourse && formalCourse.applyCourseType,
              applyCourseName: formalCourse && formalCourse.eduCourse && formalCourse.eduCourse.name,
            };

            return {
              id,
              spuId,
              course: _course,
              errors: formatErrorMsg(courseBizErrorMsgList),
              dialogOpen: false,
              productSkuDTOList: productSkuDTOList.map(({ productSkuDTO, validityDescription }) => {
                return {
                  validityDescription,
                  ...productSkuDTO,
                };
              }),
            };
          });
          return {
            datasets,
            totalItem: data.total,
            current: (data.pageable && data.pageable.pageNumber) || 1,
            pageSize: 10,
          };
        });
      }

      return findOfflineCourseWithCondition({
        pageRequest,
        offineCourseQueryCommand,
      }).then(data => {
        const datasets = data.content.map(({ productSkuDTOList, courseBizErrorMsgList, course, spuId }) => {
          return {
            id: course.id,
            spuId,
            course,
            errors: formatErrorMsg(courseBizErrorMsgList),
            dialogOpen: false,
            productSkuDTOList: productSkuDTOList.map(({ productSkuDTO, validityDescription }) => {
              return {
                validityDescription,
                ...productSkuDTO,
              };
            }),
          };
        });
        return {
          datasets,
          totalItem: data.total,
          current: (data.pageable && data.pageable.pageNumber) || 1,
          pageSize: 10,
        };
      });
    },

    afterFetch: ({ datasets, ext, setExt }) => {
      const defaultExt = datasets.reduce((obj, dataset) => {
        if (dataset && dataset.productSkuDTOList) {
          if (dataset.productSkuDTOList.length === 1) {
            obj[dataset.id] = { skuId: dataset.productSkuDTOList[0].id };
          } else if (dataset.productSkuDTOList.length > 1) {
            // 置空标志位
            obj[dataset.id] = { ...ext[dataset.id], dialogOpen: 0 };
          }
        }
        return obj;
      }, {});
      setExt(defaultExt);
    },

    onSubmit,
  });
}
