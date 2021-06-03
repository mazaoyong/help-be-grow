
import React, { useState, useContext } from 'react';
import { BlockLoading } from 'zent';
import set from 'lodash/set';
// import filter from 'lodash/filter';
import LineChart from '../../../components/charts/LineChart';
import { ECHART_LINE_OPTION } from '../../../components/charts/constants';
import { useInitCourseData } from '../../hooks/course';
import DateInput from '../../../components/date-input';
import CourseSelectPop from '../../../components/course-select-pop';
import { campus } from '../../../reducers/campus';
import { DATE_TYPE } from '../../config';
import { lastValidDate } from '../../../common/config';

import './index.scss';

function Course() {
  const defaultCourseIds: number[] = [];
  const { context } = useContext(campus);
  const [dateType, setDateType] = useState('3');
  const [startDay, setStartDay] = useState('');
  const [endDay, setEndDay] = useState('');
  const [courseIdList, setCourseIdList] = useState(defaultCourseIds);
  const [showCourseIdList, setShowCourseIdList] = useState(defaultCourseIds);
  const {
    data,
    loading,
    setData,
  } = useInitCourseData(
    dateType,
    startDay,
    endDay,
    courseIdList,
    setCourseIdList,
    setShowCourseIdList,
    context.subKdtId,
  );

  const onChangeTime = (timeArr, dateType) => {
    const [startDayNext, endDayNext] = timeArr;
    setStartDay(startDayNext);
    setEndDay(endDayNext);
    setDateType(dateType);
    setCourseIdList([]);
    setShowCourseIdList([]);
  };

  const processOption = (option = {}) => {
    set(option, 'series[0].tooltip.formatter', params => {
      const { marker, data } = params;
      return `${data.name}<br/>${marker}课程收款：${data.value} 元`;
    });
    return option;
  };

  const onSourceChange = (_type, ids) => {
    setShowCourseIdList(ids);
    if (ids.length) {
      setCourseIdList(ids);
    } else {
      setData([]);
    }
  };

  // const onKeywordChange = (ids) => {
  //   const remainedCourseIdList = filter(showCourseIdList, id => {
  //     return ids.indexOf(id) !== -1;
  //   });
  //   setShowCourseIdList(remainedCourseIdList);
  // };

  const onClose = () => {
    setCourseIdList(showCourseIdList);
  };

  const clsPrefix = 'course-container';

  return (
    <div className={clsPrefix}>
      <BlockLoading loading={loading}>
        <div className={`${clsPrefix}__header`}>
          <h2>
            课程收款分布
            {/* <a className="export-link">导出</a> */}
          </h2>
          <div className={`${clsPrefix}__header-right`}>
            <DateInput
              config={DATE_TYPE}
              active={dateType}
              statsValid={lastValidDate}
              onChangeTime={onChangeTime}
            />
          </div>
        </div>
        <CourseSelectPop
          kdtId={context.subKdtId}
          indicatrix={showCourseIdList}
          onChange={onSourceChange}
          // onKeywordChange={onKeywordChange}
          onClose={onClose}
        />
        <LineChart
          notMerge
          option={{
            grid: {
              borderWidth: 0,
              x: 75,
              x2: 45,
              y: 55,
              y2: 24,
            },
            title: {
              textStyle: {
                color: '#999',
                fontSize: 12,
                fontWeight: 'normal',
                align: 'center',
              },
            },
            legend: {
              show: false,
            },
            xAxis: [
              {
                ...ECHART_LINE_OPTION.xAxis[0],
                axisLabel: {
                  interval: 0,
                  textStyle: {
                    color: '#969799',
                  },
                  formatter: function(name) {
                    if (name && name.length > 10) {
                      name = name.slice(0, 10) + '...';
                    }
                    return name;
                  },
                },
              },
            ],
            yAxis: [
              {
                ...ECHART_LINE_OPTION.yAxis[0],
                name: '课程收款（元）',
              },
            ],
          }}
          legendInfo={{
            data,
            xAxisKey: 'courseName',
            yAxisKeys: [{
              key: 'paidAmount',
              title: '课程收款',
              type: 'money',
              chartType: 'bar',
              unit: '元',
            }],
          }}
          processOption={processOption}
          style={{ height: '350px' }}
        />
      </BlockLoading>
    </div>
  );
}

export default Course;
