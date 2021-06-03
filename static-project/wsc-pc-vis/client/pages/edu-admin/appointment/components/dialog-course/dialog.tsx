import React, { FC, useState, useCallback, useEffect } from 'react';
import { IQueryLessionParams, IDialogCourseProps } from './types';
import { Dialog, Button, Grid, Notify, Input } from 'zent';
import { Select as EbizSelect } from '@youzan/ebiz-components';
import { getLessonsByPage, getdayList, getCourseList, getAddressList } from '../../api';
import { getShopList } from '@ability-center/shop/shop-choose';
import { isEduBranchStore, isEduHqStore, isEduSingleStore } from '@youzan/utils-shop';
import './styles.scss';
import { findPageByEduCourse } from '../../../../edu-admin/api/educourse';
import {
  styleNamePrefix,
  CourseType,
  ONEDAY,
  dateNow,
  defaultPageInfo,
  allCourseOption,
  allOptionId,
  allAddressOption,
} from './constants';
import { ScheduleNewDialog } from '../../../../new-dialogs';
import DateMarkPicker from '../date-mark-picker';
import { safeToNumber, filterNilValue, formatId, setDateTime, getMonthRangeTime } from './utils';
import { EmptyLabel, Footer, columns } from './components';
import VersionWrapper from 'fns/version';
import { IEbizSelectProps, IEbizSelectAsyncProps } from '@youzan/ebiz-components/es/types/select';
import get from 'lodash/get';

const currentDate = setDateTime(dateNow, '00:00:00.000');
const currentTime = currentDate.getTime();

const DialogCourse: FC<IDialogCourseProps> = ({
  onClose,
  visible,
  onConfirm,
  courseType,
  studentId,
  assetNo,
  eduCourseInfo,
  branchInfo,
  isConfirm,
  isEdit,
  lessonInfo,
  studentLessonNo,
}) => {
  // 选择的日期
  const [date, setDate] = useState(currentTime);
  // 选择的课程
  const [course, setCourse] = useState('');
  // 选择的地点或校区
  const [place, setPlace] = useState('');
  // 课节搜索
  const [lesson, setLesson] = useState('');
  // 选择的地点或校区的placeholde
  const [placePlaceHolder, setPlacePlaceHolder] = useState('');
  // 地址或校区列表
  const [addressList, setAddressList] = useState([]);
  // 可选的日期
  const [availbleDate, setAvailbleDate] = useState([]);
  // 列表数据
  const [listData, setListData] = useState([]);
  // 列表是否loading
  const [listLoading, setListLoading] = useState(false);
  // 列表page信息
  const [pageInfo, setPageInfo] = useState({
    ...defaultPageInfo,
  });

  // 首次进来加载列表
  useEffect(() => {
    if (visible) {
      setListLoading(true);
      fetchAvalibleDate(true, false, new Date(date).getFullYear(), new Date(date).getMonth());
    } else {
      // 因为关闭对话框后，组件不会unmount，所以需要手动reset state
      setDate(currentTime);
      setCourse(eduCourseInfo ? `${eduCourseInfo.eduCourseId}` : '');
      setPlace(isEduHqStore ? (branchInfo ? `${branchInfo.kdtId}` : '') : '');
      setPlacePlaceHolder(
        isEduHqStore ? (branchInfo ? branchInfo.shopName : '请选择上课校区') : '请选择上课地点',
      );
      setAddressList([]);
      setAvailbleDate([]);
      setListData([]);
      setPageInfo({
        ...defaultPageInfo,
      });
      setLesson('');
    }
  }, [eduCourseInfo, visible, course, place, lesson]);

  useEffect(() => {
    if (visible) {
      if (isEduSingleStore) {
        getAddress();
      }
    }
  }, [visible]);

  // 在筛选条件改变时都需要重新获取
  useEffect(() => {
    if (isEduSingleStore) {
      getAddress();
    }
    refreshList();
  }, [date]);

  useEffect(() => {
    if (typeof eduCourseInfo !== 'undefined') {
      setCourse(`${eduCourseInfo.eduCourseId}`);
    }
  }, [eduCourseInfo]);

  useEffect(() => {
    // 如果选择全部课程，那么重置校区或地点
    // 编辑时选择全部课程不能重置校区
    if (
      +course === allOptionId &&
      (!isConfirm && !isEdit) &&
      !(isEduHqStore && courseType === CourseType.formalLesson)
    ) {
      setPlace('');
      if (isEduHqStore) {
        setPlacePlaceHolder('');
      }
    }
    if (isEduSingleStore) {
      getAddress();
    }
  }, [course]);

  useEffect(() => {
    if (isEduHqStore && branchInfo) {
      setPlace(`${branchInfo.kdtId}`);
    }
  }, [branchInfo]);

  // 刷新列表
  const refreshList = () => {
    if (visible) {
      setListLoading(true);
      fetchLessionList();
    }
  };

  // 获取课程请求参数
  const getLessonParams = () => {
    const query: IQueryLessionParams = VersionWrapper({
      name: 'appointment-chooselesson-get-filter',
      children: {
        startTime: safeToNumber(date),
        endTime: safeToNumber(date !== 0 ? date + ONEDAY - 1 : 0),
        eduCourseId: safeToNumber(formatId(course)),
        courseType,
        studentAsset: {
          studentId,
        },
        lessonName: lesson,
        simulateLessonNo: isEdit ? get(lessonInfo, 'lessonNo', '') : '',
      },
    });
    if (isEduHqStore) {
      query.kdtId = safeToNumber(place);
    } else if (isEduSingleStore) {
      query.addressId = safeToNumber(formatId(place));
    }

    if (courseType === CourseType.formalLesson) {
      query.studentAsset.assetNo = assetNo;
    }
    filterNilValue(query);
    return query;
  };

  // 获取日期
  const fetchAvalibleDate = (isInit: boolean, isOpen?: boolean, year?: number, month?: number) => {
    const timeRange = getMonthRangeTime(false, year, month);
    const { startTime, endTime } = timeRange;
    let query: IQueryLessionParams = VersionWrapper({
      name: 'appointment-chooselesson-get-filter',
      children: {
        startTime,
        endTime,
        eduCourseId: safeToNumber(formatId(course)),
        courseType: courseType,
        studentAsset: {
          studentId,
        },
        lessonName: lesson,
        simulateLessonNo: isEdit ? get(lessonInfo, 'lessonNo', '') : '',
      },
    });
    if (isEduHqStore) {
      query.kdtId = safeToNumber(place);
    }
    if (courseType === CourseType.formalLesson) {
      // @ts-ignore
      query.studentAsset.assetNo = assetNo;
    }
    filterNilValue(query);
    return getdayList({ query })
      .then(data => {
        setAvailbleDate(data);
        if (isInit && !isOpen) {
          if (data.length > 0) {
            const formateDates = data.map(item => {
              let date = new Date(item);
              date.setHours(0);
              return date;
            });
            const formateTimeStamp = formateDates.map(item => item.getTime());
            let hasLaterThanToday = false;
            for (let ts of formateTimeStamp) {
              if (ts >= currentTime) {
                hasLaterThanToday = true;
                ts === date && refreshList();
                setDate(ts);
                break;
              }
            }
            if (!hasLaterThanToday) {
              refreshList();
            }
          } else {
            refreshList();
            // setDate(date);
          }
        }
      })
      .catch(err => Notify.error(err));
  };

  // 获取课程
  const fetchCourse = (filterKeyword: any, { current, pageSize }: any) => {
    const query: any = {
      name: filterKeyword,
    };
    if (isEduHqStore && (courseType === CourseType.formalLesson || isConfirm)) {
      query.kdtId = safeToNumber(place);
    }
    return getCourseList({
      query,
      pageRequest: {
        pageNumber: current,
        pageSize,
      },
    }).then(({ content = [], total }) => {
      // 获取地点
      /* if (isEduSingleStore) {
        getAddress();
      } */
      const options = content.map(item => {
        return {
          text: item.name,
          value: item.id,
        };
      });
      options.unshift(allCourseOption);
      return {
        options,
        pageInfo: {
          current,
          total,
        },
      };
    });
  };

  // 获取地址
  const getAddress = () => {
    if (!visible) return;
    let query = getLessonParams();
    delete query.addressId;
    delete query.kdtId;
    getAddressList({ query }).then(data => {
      const address = data.map(item => {
        return {
          text: item.addressName,
          value: item.addressId,
        };
      });
      address.unshift(allAddressOption);
      setAddressList(address);
    });
  };

  // 获取校区
  const fetchPlace: IEbizSelectAsyncProps['fetchOptions'] = (
    filterKeyword,
    { current, pageSize },
  ) => {
    let query = {
      id: safeToNumber(formatId(course)),
      name: filterKeyword,
      kdtId: _global.kdtId,
    };
    filterNilValue(query);
    return new Promise((resolve, reject) => {
      getShopList({
        addAll: false,
        query,
        pageRequest: {
          pageNumber: current,
          pageSize,
        },
        cb: (options, total) => {
          resolve({
            options,
            pageInfo: {
              current,
              total,
            },
          });
        },
        fetchApi: (query, pageRequest) => {
          return findPageByEduCourse({
            eduCourseShopQuery: query,
            pageRequest,
          });
        },
      }).catch(err => {
        reject(err);
      });
    });
  };

  // 获取课节列表
  const fetchLessionList = (current?: number) => {
    const query = getLessonParams();
    getLessonsByPage({
      query,
      pageSize: pageInfo.pageSize,
      pageNumber: current || pageInfo.current,
    }).then(data => {
      setListData(data.content);
      setListLoading(false);
      setPageInfo({
        ...pageInfo,
        total: data.total,
        current: current || pageInfo.current,
      });
    });
  };

  const onDateChange = useCallback(val => {
    setDate(val);
  }, []);
  const onCourseSelect = useCallback(val => {
    setCourse(val);
  }, []);
  const onPlaceSelect = useCallback(val => {
    setPlace(val);
  }, []);
  const onLessonPressEnter = useCallback(val => {
    setLesson(val.target.value);
  }, []);

  const refresh = useCallback(() => {
    setListLoading(true);
    fetchLessionList(pageInfo ? pageInfo.current : 1);
  }, [pageInfo]);

  // 总部校区下拉框属性
  const hqStoreProps: IEbizSelectProps = {
    mode: 'async',
    fetchOptions: fetchPlace,
    filter: true,
    fetchOnMounted: true,
    fetchOnOpened: true,
  };

  // 单店地址下拉框属性
  const singleStoreProps: IEbizSelectProps = {
    mode: 'sync',
    options: addressList,
  };
  const placeProps = isEduHqStore ? hqStoreProps : singleStoreProps;
  const openNewScheduleTitle =
    courseType === CourseType.experienceLesson ? '新建试听日程' : '新建日程';
  return (
    <Dialog
      onClose={onClose}
      title="选择上课日程"
      visible={visible}
      maskClosable={false}
      footer={<Footer onClose={onClose} onConfirm={onConfirm} />}
    >
      <div className={`${styleNamePrefix}__cont`}>
        <div className={`${styleNamePrefix}__cont-header`}>
          <div className={`${styleNamePrefix}__cont-header-lt`}>
            <Button
              type="primary"
              onClick={() => {
                ScheduleNewDialog.open(openNewScheduleTitle, {
                  isTry: courseType === CourseType.experienceLesson,
                });
              }}
            >
              新建日程
            </Button>
            <Button
              onClick={() => {
                refreshList();
              }}
            >
              刷新
            </Button>
          </div>
          <div className={`${styleNamePrefix}__cont-header-rt`}>
            <DateMarkPicker
              value={date}
              onChange={onDateChange}
              onMonthChange={(year, month) => fetchAvalibleDate(false, false, year, month)}
              onOpen={(year, month) => fetchAvalibleDate(false, true, year, month)}
              valueType="number"
              width="184px"
              mark={availbleDate}
              canClear={false}
            />
            <VersionWrapper name="appointment-chooselesson">
              <EbizSelect
                width="184px"
                mode="async"
                // defaultValue={['all']}
                // defaultOptions={[
                //   { text: '全部', value: 'all' },
                // ]}
                disabled={
                  isConfirm || courseType === CourseType.experienceLesson
                    ? false
                    : eduCourseInfo != null
                }
                fetchOptions={fetchCourse}
                filter={true}
                fetchOnOpened={true}
                onChange={onCourseSelect}
                placeholder={eduCourseInfo ? eduCourseInfo.eduCoursePlaceholder : '请选择上课课程'}
              />
            </VersionWrapper>
            {!isEduBranchStore && (
              <EbizSelect
                width="184px"
                disabled={
                  (courseType !== CourseType.experienceLesson && !formatId(course)) ||
                  (isEduHqStore && (courseType === CourseType.formalLesson || isConfirm || isEdit))
                }
                onChange={onPlaceSelect}
                placeholder={placePlaceHolder}
                {...placeProps}
              />
            )}
            <Input
              icon="search"
              placeholder="课节搜索"
              showClear
              inline
              onPressEnter={onLessonPressEnter}
              className={`${styleNamePrefix}__lesson-search`}
            />
          </div>
        </div>
        <div className={`${styleNamePrefix}__cont-body`}>
          <Grid
            columns={columns(studentId, refresh, studentLessonNo, isEdit)}
            ellipsis={true}
            datasets={listData}
            rowKey="lessonNo"
            loading={listLoading}
            pageInfo={listData.length === 0 ? undefined : pageInfo}
            emptyLabel={<EmptyLabel courseType={courseType} />}
            onChange={({ current }) => {
              setPageInfo({
                ...pageInfo,
                current: current as number,
              });
              setListLoading(true);
              fetchLessionList(current);
            }}
            scroll={{ x: 1000 }}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default DialogCourse;
