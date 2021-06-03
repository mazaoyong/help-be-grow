import React, { useEffect, useState } from 'react';
import { Select } from '@youzan/ebiz-components';
import { getAllCourseGroup } from '../../api/course-group';
import { fetchAllCourseGroupOptions } from '../../common/select-options';

// 包裹课程分组过滤项的HOC
export default function Wrapper(Comp) {
  return function NewComp(props) {
    const [listData, setListData] = useState([{ text: '全部', value: -1 }]);
    const fetchList = () => {
      getAllCourseGroup().then(res => {
        setListData([
          { text: '全部', value: -1 },
          ...res.content.map(item => ({
            text: item.title,
            value: item.groupId,
          })),
        ]);
      });
    };

    useEffect(() => {
      fetchList();
    }, []);

    return <Comp groupList={listData} {...props}/>;
  };
}

export const courseGroupSelectConfig = {
  type: 'Custom',
  name: 'groupId',
  label: '课程分组：',
  component: Select,
  placeholder: '请选择或输入搜索',
  filter: true,
  width: '185px',
  mode: 'async',
  fetchOnMounted: true,
  fetchOptions: fetchAllCourseGroupOptions,
  autoWidth: true,
  format: data => Promise.resolve({ value: data }),
  defaultOptions: [{ text: '全部', value: '' }],
};
