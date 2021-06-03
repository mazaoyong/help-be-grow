
import { Form } from '@zent/compat';
import React, { useCallback, useState } from 'react';

import Select from './components/select';
import Trigger from './trigger';
import Content from './content';

import { findStudentAndClueInfoByNameOrPhoneNumber } from '../../../../api';
import { formatStudentDetail, formatClueDetail } from '../../../../util';

const { getControlGroup } = Form;

let timestamp = 0;
let ajaxVersion = 0;

function UserField({ disabled, userName, value, onChange, onBlur }) {
  const [ options, setOptions ] = useState({
    clues: [],
    students: [],
  });

  const handleChange = useCallback(data => {
    onChange(data);
  }, [onChange]);

  const handleBlur = useCallback(data => {
    onBlur(data);
  }, [onBlur]);

  const handleAsyncFilter = useCallback(
    keyword => new Promise((resolve, reject) => {
      const _timestamp = Date.now();
      if (_timestamp > timestamp + 3000) {
        return resolve();
      }

      timestamp = _timestamp;
      setTimeout(() => {
        if (_timestamp === timestamp) {
          return resolve();
        }
        reject();
      }, 1000);
    })
      .then(() => {
        // 标记当前版本号
        ajaxVersion++;
        const _ajaxVersion = ajaxVersion;

        const params = {
          operatorId: window._global.userId,
        };

        const isNumber = /^[0-9]*$/.test(keyword);

        if (isNumber) {
          params.mobile = keyword;
        } else {
          params.name = keyword;
        }

        return findStudentAndClueInfoByNameOrPhoneNumber(params)
          .then(({ clueList, studentCustomerList }) => {
            // 根据ajax版本号判断这个请求是否过期，是否应该被丢弃
            if (_ajaxVersion < ajaxVersion) {
              return;
            }

            const clues = clueList.map(formatClueDetail);
            const students = studentCustomerList.map(formatStudentDetail);
            setOptions({ clues, students });
          });
      }),
    [],
  );

  return (
    <div>
      <Select
        placeholder="请输入姓名/手机号以搜索"
        triggerComp={Trigger}
        contentComp={Content}
        keyword={userName}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onAsyncFilter={handleAsyncFilter}
        options={options}
      />
    </div>
  );
}

export default getControlGroup(UserField);
