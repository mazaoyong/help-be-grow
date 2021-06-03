
import { Pop, Form, Table } from '@zent/compat';
import React, { useState, useCallback, useMemo, useContext } from 'react';
import { ClampLines, Icon, Tag } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
import { format } from 'date-fns';
import accSub from 'zan-utils/number/accSub';

import { Context as UserContext } from '../../contexts/user';
import { Context as PriceContext, CHANGE_COURSES } from '../../contexts/price';
import openCourseSelector from './components/course-selector';
import Discount from './components/discount';
import NumberInput from '../../components/number-input';
import SkuSelector from './components/sku-selector';

import { getEduClassBySkuIdAndGoodsId } from '../../api';
import { cent2yuan, yuan2cent, formatSkuErrors, computeSkuStr } from '../../util';

const { getControlGroup } = Form;

const extColumns = [
  {
    title: '价格',
    bodyRender: ({ price }) => <span className="edu-enrollment-price-wrapper">{cent2yuan(price)}</span>,
    width: '80px',
    textAlign: 'right',
  },
  {
    title: '名额',
    name: 'stockNum',
    width: '80px',
  },
];

// temparary
let temp = {
  courses: [],
  validityDescriptions: [],
  value: [],
};

function CourseField({ value, onChange }) {
  const { state: userState } = useContext(UserContext);
  const { dispatch: priceDispatch } = useContext(PriceContext);

  const disabled = !userState.item;

  const [ courses, setCourses ] = useState([]);
  const [ validityDescriptions, setValidityDescriptions ] = useState([]);

  const handleCourseChange = useCallback(val => {
    priceDispatch({
      type: CHANGE_COURSES,
      payload: val,
    });
    onChange(val);
  }, [priceDispatch, onChange]);

  const handleCourseDetailChange = useCallback((index, key, val) => {
    value[index][key] = val;
    handleCourseChange(value.concat());
  }, [value, handleCourseChange]);

  const handleCourseDetailsChange = useCallback(objs => {
    for (const obj of objs) {
      value[obj[0]][obj[1]] = obj[2];
      handleCourseChange(value.concat());
    }
  }, [value, handleCourseChange]);

  const handleAdd = useCallback(() => {
    const studentAggregate = {
      studentDTO: {},
    };
    studentAggregate.studentDTO.name = userState.item.name;
    studentAggregate.studentDTO.mobile = userState.item.mobile;
    console.log('userState', userState);
    if (userState.mode === 'clue') {
      studentAggregate.clueId = userState.item.clueId;
    } else if (userState.mode === 'student' || userState.mode === 'order') {
      if (userState.item.userId !== null) {
        studentAggregate.userId = userState.item.userId;
      } else {
        studentAggregate.userId = 0;
      }
      studentAggregate.eduStudentID = userState.item.eduStudentID;
    }

    // store temp data and clear state
    temp = {
      courses,
      validityDescriptions,
      value,
    };

    setCourses([]);
    setValidityDescriptions([]);
    handleCourseChange([]);

    openCourseSelector({
      studentAggregate,
      studentName: userState.item && userState.item.name,
      selectedRows: courses,
      ext: value ? value.reduce((obj, { courseId, skuId }) => Object.assign(obj, { [courseId]: { skuId } }), {}) : {},
      onSubmit: (data, ext) => {
        if (!data || data.length === 0) {
          return Promise.reject('请至少选择一门课程');
        }
        return Promise.all(data.map(item => {
          const spuId = item.spuId;
          const skuId = item.course && ext[item.course.id] && ext[item.course.id].skuId;
          if (spuId) {
            return null;
          }
          if (!skuId) {
            return Promise.reject('请选择规格值');
          }
          if (item.course.courseSellType === 3) {
            return getEduClassBySkuIdAndGoodsId({
              goodsId: item.course && item.course.id,
              skuId,
            });
          }
          return null;
        })).then(results => {
          const validityDescriptions = results.map(result => {
            if (!result) {
              return null;
            }
            return (
              <>
                <div>{format(result.startTime, 'YYYY-MM-DD')}至</div>
                <div>{format(result.endTime, 'YYYY-MM-DD')}</div>
              </>
            );
          });
          const val = data.map(({
            id,
            spuId,
            course: {
              id: courseId,
              alias: productAlias,
              title,
              courseSellType,
              validityPeriodType,
              price: coursePrice,
            },
            productSkuDTOList,
          }) => {
            let skuId = null;
            let price = coursePrice;
            if (productSkuDTOList && productSkuDTOList.length > 0) {
              skuId = ext[id].skuId;
              const sku = productSkuDTOList.find(item => item.id === skuId);
              price = sku.price;
            } else {
              skuId = spuId;
            }
            const showFreeCourseTime = courseSellType === 1;
            const showFreeCourseValidity = courseSellType === 2 ||
              ((courseSellType === 1) && (validityPeriodType === 2));
            return {
              courseId,
              productAlias,
              title,
              freeCourseTime: showFreeCourseTime ? 0 : null,
              freeCourseValidity: showFreeCourseValidity ? 0 : null,
              isEditPrice: false,
              price,
              realPrice: price,
              skuId,
            };
          });

          handleCourseChange(val);
          setCourses(data);
          setValidityDescriptions(validityDescriptions);
        });
      },
      onClose: () => {
        setCourses(temp.courses);
        setValidityDescriptions(temp.validityDescriptions);
        handleCourseChange(temp.value);
      },
    });
  },
  [
    validityDescriptions,
    setValidityDescriptions,
    courses,
    handleCourseChange,
    value,
    userState,
    setCourses,
  ]);

  const handleRemove = useCallback(row => () => {
    const cour = (courses || []).concat();
    cour.splice(row, 1);

    const val = (value || []).concat();
    val.splice(row, 1);

    const validity = (validityDescriptions || []).concat();
    validity.splice(row, 1);

    setCourses(cour);
    handleCourseChange(val);
    setValidityDescriptions(validity);
  }, [value, courses, validityDescriptions, handleCourseChange]);

  const columns = useMemo(() => [
    {
      title: '线下课名称',
      bodyRender: (_, { row }) => {
        const data = courses[row];
        return (
          <div>
            <a
              className="edu-enrollment-courses-title"
              href={`//h5.youzan.com/wscvis/edu/prod-detail?alias=${data.course && data.course.alias}&kdt_id=${window._global.kdtId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ClampLines
                lines={1}
                popWidth={120}
                text={(data.course && data.course.title) || ''}
              />
            </a>
            {
              data.course && data.course.courseType === 0 ? (
                <Tag borderColor="#F1924E" bgColor="#FFF5ED" fontColor="#F1924E">体验课</Tag>
              ) : null
            }
          </div>
        );
      },
    },
    {
      title: '课程规格',
      bodyRender: ({ skuId }, { row }) => {
        const course = courses[row] || {};
        const { productSkuDTOList = [], errors = [] } = course;

        if (productSkuDTOList.length === 0) {
          return '-';
        }

        const _sku = productSkuDTOList.find(curSku => curSku.id === skuId);
        const skuStr = computeSkuStr(_sku);
        const skuErrors = formatSkuErrors(errors, course, userState.name);

        if (skuErrors.allLack || errors.overLimit) {
          return <span className="edu-enrollment-sku-select-grey">选择规格</span>;
        }

        return (
          <div className="edu-enrollment-sku-wrapper">
            {skuStr || null}
            <SkuSelector
              initialValue={skuId ? [skuId] : []}
              data={productSkuDTOList}
              extColumns={extColumns}
              skuErrors={skuErrors}
              onSelect={skuIds => {
                const course = courses[row] || {};
                const { productSkuDTOList = [] } = course;
                const selectedSku = productSkuDTOList.find(curSku => curSku.id === skuIds[0]);
                handleCourseDetailsChange([
                  [row, 'skuId', selectedSku.id],
                  [row, 'price', selectedSku.price],
                  [row, 'realPrice', selectedSku.price],
                ]);
              }}
            >
              {skuStr ? <Icon type="edit-o" /> : <a href="javascript: void(0);">{skuStr || '选择规格' }</a>}
            </SkuSelector>
          </div>
        );
      },
    },
    {
      title: '课时',
      bodyRender: ({ skuId }, { row }) => {
        const isSellType1 = courses[row] &&
          courses[row].course &&
          (courses[row].course.courseSellType === 1);

        if (isSellType1) {
          const productSkuDTOList = (courses[row] && courses[row].productSkuDTOList) || [];
          const hasSku = productSkuDTOList.length > 0;
          if (!hasSku) {
            return '-';
          }

          const _sku = productSkuDTOList.find(curSku => curSku.id === skuId);
          return _sku && _sku.courseProp;
        }

        return '-';
      },
    },
    {
      title: '有效期',
      bodyRender: ({ skuId }, { row }) => {
        const isClassCourse = courses[row] &&
          courses[row].course &&
          (courses[row].course.courseSellType === 3);
        if (isClassCourse) {
          return validityDescriptions[row];
        }

        const productSkuDTOList = courses[row].productSkuDTOList || [];
        const hasSku = productSkuDTOList.length > 0;
        if (!hasSku) {
          return '-';
        }

        const _sku = productSkuDTOList.find(curSku => curSku.id === skuId);
        const validityDescription = (_sku && _sku.validityDescription) || '-';
        return validityDescription.split('\n').map((str, key) => (
          <div key={key}>{str}</div>
        ));
      },
    },
    {
      title: '价格',
      textAlign: 'right',
      bodyRender: ({ price }, { row }) => (
        <div className="edu-enrollment-courses-price edu-enrollment-price-wrapper">
          {cent2yuan(price)}
        </div>
      ),
    },
    {
      title: '赠送课时',
      bodyRender: ({ freeCourseTime }, { row }) => {
        const courseSellType = courses[row] &&
          courses[row].course &&
          courses[row].course.courseSellType;
        const _freeCourseTime = cent2yuan(freeCourseTime || 0, true);
        const handleFreeCourseTimeChange = v => {
          handleCourseDetailChange(row, 'freeCourseTime', yuan2cent(v));
        };
        if (courseSellType === 1) {
          return (
            <NumberInput
              width="80px"
              decimal={2}
              value={_freeCourseTime}
              onChange={handleFreeCourseTimeChange}
            />
          );
        }
        return '-';
      },
    },
    {
      title: '赠送有效期',
      bodyRender: ({ freeCourseValidity }, { row }) => {
        const courseSellType = courses[row] &&
          courses[row].course &&
          courses[row].course.courseSellType;

        const validityPeriodType = courses[row] &&
          courses[row].course &&
          courses[row].course.validityPeriodType;

        const handleFreeCourseValidityChange = v => {
          handleCourseDetailChange(row, 'freeCourseValidity', v);
        };
        const showFreeCourseValidity = courseSellType === 2 || ((courseSellType === 1) && (validityPeriodType === 2));
        if (showFreeCourseValidity) {
          return (
            <NumberInput
              width="96px"
              addonAfter="天"
              decimal={0}
              value={freeCourseValidity}
              onChange={handleFreeCourseValidityChange}
            />
          );
        }
        return '-';
      },
    },
    {
      title: '实收价格',
      textAlign: 'right',
      bodyRender: ({ realPrice, price }, { row }) => {
        const valueYuan = cent2yuan(realPrice, true);
        const maxYuan = cent2yuan(price);
        const handleRealPriceChange = v => {
          const valueCent = yuan2cent(v);
          handleCourseDetailChange(row, 'realPrice', valueCent);
        };
        return (
          <NumberInput
            width="96px"
            addonBefore="¥"
            decimal={2}
            className="real-price"
            max={maxYuan}
            value={valueYuan}
            onChange={handleRealPriceChange}
          />
        );
      },
    },
    {
      title: '单品优惠',
      bodyRender: ({ realPrice, price }, { row }) => {
        const discount = accSub(price, realPrice).valueOf();
        return (
          <div>
            -
            {
              discount ? (
                <span className="edu-enrollment-price-wrapper">
                  {cent2yuan(discount)}
                </span>
              ) : null
            }
          </div>
        );
      },
    },
    {
      title: '操作',
      width: '48px',
      bodyRender: (data, { row }) => {
        return (
          <a onClick={handleRemove(row)}>删除</a>
        );
      },
    },
  ], [
    userState,
    courses,
    validityDescriptions,
    handleCourseDetailChange,
    handleCourseDetailsChange,
    handleRemove,
  ]);

  const renderTrigger = useCallback(() => {
    const trigger = <SamButton name="编辑" disabled={disabled} type="primary" onClick={handleAdd}>添加课程</SamButton>;
    if (disabled) {
      return (
        <Pop trigger="hover" position="top-left" content="请先添加学员信息">
          {trigger}
        </Pop>
      );
    }
    return trigger;
  }, [disabled, handleAdd]);

  return (
    <>
      {renderTrigger()}
      {courses.length > 0 ? (
        <>
          <Table
            className="edu-enrollment-courses-list"
            columns={columns}
            datasets={value}
            pageInfo={null}
            rowKey="id"
          />
          <Discount value={value} courses={courses} />
        </>
      ) : null}
    </>
  );
}

export default getControlGroup(CourseField);
