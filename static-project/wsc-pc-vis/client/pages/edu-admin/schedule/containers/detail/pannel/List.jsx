import React, { PureComponent } from 'react';
import { number } from '@youzan/utils';
import formatDate from 'zan-utils/date/formatDate';
import { isEduHqStore, isEduSingleStore } from 'fns/chain';
import InfoDetailList from 'pages/edu-admin/components/info-detail-list';

function parseAppointmentConfig(appointmentConfigDTO) {
  if (!appointmentConfigDTO) return {};
  const { canCancelAppointmentHour = 1, isCancelAppointment = 0, stopAppointmentHour = 1,
    startAppointmentDay = 1, trialCourseOccupyQuota = 1, isAppointmentLimit = 0 } = appointmentConfigDTO;

  return {
    appointmentRule: isAppointmentLimit
      ? `可提前${startAppointmentDay}天预约\n课程开始前${stopAppointmentHour}小时停止预约`
      : '无限制',
    cancellationRule: isCancelAppointment ? `上课前${canCancelAppointmentHour}小时允许取消` : '不允许取消',
    trialRule: trialCourseOccupyQuota ? '占用上课名额' : '不占用上课名额',
  };
}

export default class List extends PureComponent {
  parseDetailList = () => {
    const { data = {} } = this.props;
    const appointmentConfig = parseAppointmentConfig(data && data.eduConfigDTO);

    return [
      {
        key: '课程',
        value: data.eduCourseName,
      },
      {
        key: '时间',
        value: this.formatStartEnd(data.startTime, data.endTime),
      },
      {
        key: '老师',
        value: data.teacherName,
      },
      {
        key: '助教',
        value: data.assistantNames && data.assistantNames.join('、'),
        needClamp: true,
        hidden: !data.assistantNames || data.assistantNames.length === 0,
      },
      {
        key: '上课校区',
        value: data.shopName,
        hidden: !isEduHqStore,
      },
      {
        key: '上课地点',
        value: data.addressName,
        hidden: !isEduSingleStore,
      },
      {
        key: '教室',
        value: data.classroomName,
        needClamp: true,
      },
      {
        key: '消耗课时',
        value: data.consumeNum && number.accDiv(data.consumeNum || 0, 100),
      },
      {
        type: 'seperator',
        hidden: !data.appointRule,
      },
      {
        key: '预约设置',
        value: data.appointRule,
        hidden: !data.appointRule,
      },
      {
        key: '剩余名额',
        value: data.appointNumLeft,
        hidden: !data.appointRule,
      },
      {
        key: '预约规则',
        value: appointmentConfig.appointmentRule,
        hidden: !data.appointRule,
      },
      {
        key: '取消规则',
        value: appointmentConfig.cancellationRule,
        hidden: !data.appointRule,
      },
      {
        key: '试听名额',
        value: appointmentConfig.trialRule,
        hidden: !data.appointRule,
      },
    ];
  }

  render() {
    const { data } = this.props;
    return (
      <div className="schedule-detail_pannel-list">
        <InfoDetailList data={this.parseDetailList(data)} />
      </div>
    );
  }

  formatStartEnd(startTime, endTime) {
    const startTimeStr = formatDate(startTime, 'YYYY-MM-DD HH:mm');
    const endTimeStr = formatDate(endTime, 'YYYY-MM-DD HH:mm');
    return this.combineStartAndEnd(startTimeStr, endTimeStr);
  }

  // Used to combine times with same prefix, for example, converting (2019-03-29 13:00, 2019-03-29 15:00)
  // to 2019-03-29 13:00-15:00
  combineStartAndEnd(str1, str2) {
    const length = Math.min(str1.length, str2.length);
    let matchedIndex = 0;
    let i = 0;
    for (; i < length; ++i) {
      if (str1[i] !== str2[i]) {
        break;
      }
      // stop word is white space or "-"
      if (str1[i] === ' ' || str1[i] === '-') {
        matchedIndex = i + 1;
      }
    }
    const prefix = str1.substr(0, matchedIndex);
    const tail1 = str1.substr(matchedIndex);
    const tail2 = str2.substr(matchedIndex);
    return `${prefix}\n${tail1}-${tail2}`;
  }
}
