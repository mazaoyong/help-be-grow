import { Pop } from '@zent/compat';
import React, { FC, useCallback, useMemo } from 'react';
import { RadioGroup, Radio, IGridColumn } from 'zent';
import { Img, EduGoodsSelector } from '@youzan/ebiz-components';
import { GoodsSelectorV2 } from '@youzan/react-components';
import cx from 'classnames';
import get from 'lodash/get';
import accDiv from '@youzan/utils/number/accDiv';

import { parsePriceRange } from '../../utils';
import { EventCourseType } from '../../types';

import './styles.scss';

const { ImgWrap } = Img;

const { GoodsSelector } = EduGoodsSelector;

const { SelectResult } = GoodsSelectorV2;

const TUITION_OFFSET = 259; // 攒学费的营销活动活动id为259

const CourseSelectField: FC<{ value, onChange, disabled }> = (props) => {
  const { value = {}, onChange, disabled } = props;
  const { eventCourseType = EventCourseType.all, courseList = [] } = value;
  const showGrid = useMemo(() =>
    eventCourseType === EventCourseType.partial && courseList && courseList.length > 0
  , [courseList, eventCourseType]);

  const onFieldChange = useCallback((value) => {
    onChange(value);
  }, [onChange]);

  const onGoodsSelectorConfirm = useCallback((goodsList) => {
    const list = goodsList.value;

    onFieldChange({
      eventCourseType,
      courseList: list.map((item) => {
        const goodsSkuInfo = get(item, 'skuInfo.sku', []);
        const priceList = goodsSkuInfo
          .map(sku => Number(sku.price))
          .sort((a: number, b: number) => a - b);

        return {
          goodsId: item.goodsId,
          goodsName: item.goodsName,
          goodsImage: item.goodsImage,
          goodsDetailUrl: item.goodsDetailUrl,
          goodsPrice: goodsSkuInfo.length <= 1
            ? item.goodsPrice
            : parsePriceRange(priceList),
          goodsSkuInfo: item.goodsSkuInfo || goodsSkuInfo.map(sku => sku.skuDetail),
          skuCnt: item.skuCnt || goodsSkuInfo.length,
        };
      }),
    });
  }, [eventCourseType, onFieldChange]);

  const deleteSelectedCourse = useCallback((goodsId) => {
    const index = courseList.findIndex(course => course.goodsId === goodsId);
    if (index > -1) {
      courseList.splice(index, 1);
      onFieldChange({
        eventCourseType,
        courseList: [...courseList],
      });
    };
  }, [courseList, eventCourseType, onFieldChange]);

  const columns: IGridColumn[] = useMemo(() => [
    {
      title: '课程',
      width: 270,
      bodyRender: ({ goodsName, goodsImage, goodsDetailUrl }) =>
        <div className="selected-course">
          <ImgWrap width="106px" height="60px" src={goodsImage} alt={goodsName} />
          <Pop trigger="hover" wrapperClassName="selected-course__wrapper" content={goodsName}>
            {/* CommonLink 当Grid处于disabled 状态时链接也不可选 */}
            <a className="ellipsis-2" href={goodsDetailUrl} target="_blank" rel="noopener noreferrer">
              {goodsName}
            </a>
          </Pop>
        </div>,
    },
    {
      title: '金额(元)',
      width: 80,
      bodyRender: ({ goodsPrice, skuCnt }) => {
        if (skuCnt <= 1) { // sku种类不超过1
          return accDiv((Number(goodsPrice) || 0), 100.0).toFixed(2);
        }
        // 否则展示多sku的价格区间
        return goodsPrice;
      },
    },
    {
      title: '参与规格',
      width: 100,
      bodyRender: ({ goodsSkuInfo }) => {
        const skuInfo = goodsSkuInfo && goodsSkuInfo.map((item, index) => (
          <p key={`${item}-${index}`}>{`• ${item}`}</p>
        ));
        return (
          goodsSkuInfo
            ? <Pop trigger="hover" content={skuInfo}>
              <span className="ellipsis-2">{(goodsSkuInfo && goodsSkuInfo.join('; ')) || '-'}</span>
            </Pop>
            : null
        );
      },
    },
    {
      title: '操作',
      width: 100,
      textAlign: 'right',
      bodyRender: (data) => {
        return (
          <span
            className={cx('operation', { disabled })}
            onClick={() => disabled ? {} : deleteSelectedCourse(data.goodsId)}
          >
            删除
          </span>
        );
      },
    },
  ], [disabled, deleteSelectedCourse]);

  return (
    <div className="course-select">
      <RadioGroup
        className="course-select-field"
        value={eventCourseType}
        onChange={e => {
          const courseType = e.target.value;
          onFieldChange({
            eventCourseType: courseType,
            courseList: courseType === EventCourseType.all ? [] : courseList,
          });
        }}
        disabled={disabled}
      >
        <div key="all" className="course-select__option">
          <Radio value={EventCourseType.all}>
            全部课程
          </Radio>
        </div>
        <div key="partial" className="course-select__option">
          <Radio value={EventCourseType.partial}>
            部分课程
          </Radio>
          {eventCourseType === EventCourseType.partial
            ? <>
              <GoodsSelector
                btnText={courseList.length > 0 ? '修改已选课程' : '选择课程'}
                selected={{ type: 'part', value: courseList.length > 0 ? courseList : [] }}
                activityType={TUITION_OFFSET}
                disabled={disabled}
                // @ts-ignore
                backEndConfig={_global.gsConfig}
                onConfirm={onGoodsSelectorConfirm}
                selectTypes={['part']}
                needSkuInfo
                showSoldOut
                soldOutSelectable
                dictConfig={{
                  customManageUrl: `${_global.url.v4}/vis/course/column/list#/`, // 跳转到专栏，兼容微课堂版本
                }}
              />
              <div className="course-select-grid">
                <SelectResult
                  rowKey="goodsId"
                  columns={columns}
                  datasets={courseList}
                  isShow={showGrid}
                />
              </div>
            </>
            : null
          }
        </div>
      </RadioGroup>
      {(eventCourseType === EventCourseType.partial && courseList.length === 0) && <div className="form-description error-msg">
        请选择课程
      </div>}
      <div className="form-description">
        学费可用于抵扣购买活动课程。
      </div>
    </div>
  );
};

export default CourseSelectField;
