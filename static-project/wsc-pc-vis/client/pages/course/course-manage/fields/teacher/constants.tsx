import React from 'react';
import { ClampLines } from 'zent';

export const columns = [
  {
    title: '老师姓名',
    width: '20%',
    bodyRender({ staffName }) {
      if (staffName) {
        return (
          <ClampLines
            lines={2}
            popWidth={150}
            text={staffName}
          />
        );
      } else {
        return '-';
      }
    },
  },
  {
    title: '昵称',
    width: '20%',
    bodyRender({ teacherName }) {
      if (teacherName) {
        return (
          <ClampLines
            lines={2}
            popWidth={150}
            text={teacherName}
          />
        );
      } else {
        return '-';
      }
    },
  },
  {
    title: '职位描述',
    width: '50%',
    name: 'description',
    bodyRender({ description }) {
      return (
        <ClampLines
          lines={2}
          popWidth={300}
          text={description}
        />
      );
    },
  },
];

export const staffColumns = [
  {
    title: '老师姓名',
    width: '40%',
    bodyRender({ staffName }) {
      if (staffName) {
        return (
          <ClampLines
            lines={2}
            popWidth={150}
            text={staffName}
          />
        );
      } else {
        return '-';
      }
    },
  },
  {
    title: '手机号',
    bodyRender({ mobile }) {
      return mobile ?? '-';
    }
  },
];
