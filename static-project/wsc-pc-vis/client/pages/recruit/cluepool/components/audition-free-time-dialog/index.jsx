
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Button, Alert, Grid, Notify } from 'zent';
import formatDate from '@youzan/utils/date/formatDate';
import { Dialog } from '@youzan/ebiz-components';
import { getCourseList, getLessons, createAuditionAppointment } from '../../../../edu-admin/appointment/api';
import { getDefaultText } from '../../../../edu-admin/appointment/utils';
import EduSelectField from '../../../../edu-admin/appointment/components/field/edu-select';
import PlainField from '../plain-field';

import './style.scss';

const { DialogFooter } = Dialog;
const { createForm, FormInputField, Field, FormDatePickerField } = Form;
const nameSpace = 'auditon-free-time-dialog';
const dayMs = 24 * 60 * 60 * 1000;
const todayDate = new Date(formatDate(Date.now(), 'YYYY/MM/DD'));

const columns = [
  {
    title: '上课时间',
    name: 'lessonTime',
    width: '25%',
    bodyRender: ({ lessonTime, lessonNo }) => {
      return getDefaultText(lessonTime);
    },
  },
  {
    title: '课节名称',
    name: 'eduCourseName',
    width: '25%',
    bodyRender: ({ eduCourseName, lessonName }) => {
      return getDefaultText(lessonName || eduCourseName);
    },
  },
  {
    title: '上课教室',
    name: 'classroomName',
    width: '20%',
    bodyRender: ({ classroomName }) => {
      return getDefaultText(classroomName);
    },
  },
  {
    title: '老师',
    name: 'teacherName',
    bodyRender: ({ teacherName }) => {
      return getDefaultText(teacherName);
    },
  },
  {
    title: '剩余名额',
    name: 'appointNumLeft',
    textAlign: 'right',
    bodyRender: ({ appointNumLeft, appointRule }) => {
      return +appointRule === 0 ? '-' : getDefaultText(appointNumLeft);
    },
  },
];

class AuditionFreeTimeForm extends PureComponent {
  constructor(props) {
    super(props);
    const {
      data: { stuName, studentNo, customerId, customerTel, studentId },
    } = props;

    this.state = {
      eduCourseId: '',
      stuName,
      studentNo,
      studentId,
      customerId,
      customerTel,

      lessionLoading: false,
      submitLoading: false,
      lessionList: [], // 排课
      dayDate: '',
      courseType: '0',
      kdtId: _global.kdtId,
    };
  }

  asyncValid = values => {
    const { zentForm } = this.props;
    zentForm.asyncValidateForm(() => {
      this.onSubmit(values);
    });
  };

  onSubmit = values => {
    const {
      data: { studentId },
    } = this.props;
    const { eduCourseId, appointmentDate, comment } = values;
    const params = {
      eduCourseId,
      appointmentDate: appointmentDate + ':00',
      comment,
      studentId,
    };

    this.setState({ submitLoading: true });
    createAuditionAppointment(params)
      .then(() => {
        const { dialogref } = this.props;
        dialogref.close();
        Notify.success('办理成功');
      })
      .catch(err => {
        Notify.error(err);
      })
      .finally(() => {
        this.setState({ submitLoading: false });
      });
  };

  getEduCourseOptions = (query, pageRequest) => {
    const { kdtId } = this.state;
    return getCourseList({
      query: {
        name: query,
        kdtId: kdtId || _global.kdtId,
      },
      pageRequest,
    }).then(({ content = [], total, pageable }) => {
      const options = content.map(item => {
        return {
          text: item.name,
          value: item.id,
        };
      });
      return options;
    });
  };

  getLessonParams = () => {
    const { eduCourseId, dayDate, studentId } = this.state;
    const startTime = new Date(dayDate.split(' ')[0].replace(/-/g, '/') + ' 0:00').getTime();
    const endTime = startTime + dayMs - 1;

    const params = {
      startTime,
      endTime,
      eduCourseId,
      courseType: 0,
      studentAsset: {
        studentId,
      },
    };

    return params;
  };

  // 获取课程表
  getLession = () => {
    const { dayDate, eduCourseId } = this.state;
    if (!dayDate || !eduCourseId) {
      return;
    }

    this.setState({ lessionLoading: true, lessionList: [] });
    getLessons({ query: this.getLessonParams() })
      .then(data => {
        this.setState({ lessionList: data || [], lessionLoading: false });
      })
      .catch(err => {
        Notify.error(err);
      });
  };

  onCourseChange = e => {
    this.handleEduCourseChange(e.target.value);
  };

  handleEduCourseChange = value => {
    this.setState({ eduCourseId: value }, this.getLession);
  };

  onDateChange = value => {
    this.setState({ dayDate: value }, this.getLession);
  };

  render() {
    const {
      data: { stuName },
      dialogref,
      handleSubmit,
    } = this.props;

    const { eduCourseId, lessionList, lessionLoading, dayDate, submitLoading } = this.state;
    const isNoLessions =
      dayDate !== '' && eduCourseId !== '' && !lessionLoading && lessionList.length === 0;

    return (
      <Form horizontal onSubmit={handleSubmit(this.asyncValid)}>
        {isNoLessions && (
          <Alert className={`${nameSpace}-alert`}>
            该课程当天无排课，可考虑更改上课时间，也可继续办理试听
          </Alert>
        )}
        <PlainField label="学员：" value={stuName} required />
        <Field
          name="eduCourseId"
          label="试听课程："
          async={true}
          component={EduSelectField}
          value={eduCourseId}
          onChange={this.onCourseChange}
          placeholder={'请选择试听课程'}
          getOptions={this.getEduCourseOptions}
          create={false}
          refresh={false}
          width="184px"
          autoWidth
          required
          asyncValidation={(values, value) => {
            if (value) return Promise.resolve();
            return Promise.reject('请选择上课课程');
          }}
        />
        <FormDatePickerField
          name="appointmentDate"
          width="184px"
          label="试听时间："
          placeholder="请选择试听时间"
          min={todayDate}
          showTime
          defaultTime="09:00:00"
          required
          onChange={this.onDateChange}
          dateFormat="YYYY-MM-DD HH:mm"
          canClear={false}
          asyncValidation={(values, value) => {
            if (value) return Promise.resolve();
            return Promise.reject('请选择试听时间');
          }}
        />
        <FormInputField
          name="comment"
          width="355px"
          height="139px"
          type="textarea"
          label="备注："
          maxLength={200}
          showCount
        />
        {lessionList.length > 0 && (
          <div className={`${nameSpace}-table`}>
            <p>你选择的课程当日有排课，可依此安排试听课程：</p>
            <Grid columns={columns} datasets={lessionList} />
          </div>
        )}
        <DialogFooter>
          <Button onClick={() => void dialogref.close()}>取消</Button>
          <Button type="primary" htmlType="submit" loading={submitLoading}>
            确定
          </Button>
        </DialogFooter>
      </Form>
    );
  }
}

export default function AuditionFreeTimeDialog(data) {
  const { dialogref } = data;
  const WrappedForm = createForm({ scrollToError: true })(AuditionFreeTimeForm);
  return (
    <div className={`${nameSpace}-content`}>
      <WrappedForm data={data.data} dialogref={dialogref} />
    </div>
  );
}
