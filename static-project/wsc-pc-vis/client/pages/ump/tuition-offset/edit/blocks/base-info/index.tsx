import { Form, FormInputField, Validators } from 'zent';
import { date } from '@youzan/utils';
import { IFormCreatorConfig } from '@youzan/ebiz-components/es/types/easy-form-archive';

import DateTimeRangePicker from 'components/field/date-range-picker';
import { editType } from '../../context';
import { checkExistActivity } from '../../../api/edit';

import { EventStatus } from '../../../types';
import './styles.scss';

interface IBaseInfoProps {
  editType: editType,
  id?: string,
  eventStatus?: EventStatus,
}

interface IValidateRangeParams {
  command: {
    activityType: string,
    startAt: string;
    endAt: string;
    excludeId?: string;
  };
}

const BaseInfo = (props: IBaseInfoProps): IFormCreatorConfig[] => {
  const { id, editType, eventStatus } = props;
  const isEdit = editType === 'edit';
  const isDetail = editType === 'detail';

  const isEventOnGoing = eventStatus === EventStatus.ongoing;
  const isEventEnded = eventStatus === EventStatus.ended;

  return [
    {
      label: '活动名称：',
      name: 'name',
      className: 'event-name',
      required: '请输入活动名称',
      validators: [
        Validators.maxLength(20, '最多可输入20个字'),
      ],
      type: 'field',
      component: FormInputField,
      props: () => ({
        props: {
          width: 240,
          placeholder: '20个字以内，如：秋季攒学费活动',
        },
      }),
    },
    {
      label: '活动时间：',
      name: 'time',
      className: 'event-time',
      required: '请选择活动时间',
      component: DateTimeRangePicker,
      props: () => ({
        disabled: isDetail || (isEdit && eventStatus && isEventEnded), // zent表单时间范围选择组件不受Disabled组件影响，需手动设置
        disableStartTime: isEdit && isEventOnGoing,
      }),
      defaultValue: ['', ''],
      getValidateOption() {
        return Form.ValidateOption.IncludeAsync;
      },
      validators: [
        (val) => {
          if (!val) {
            return {
              name: 'EmptyEventTime',
              message: '请选择活动时间',
            };
          }
          if (Array.isArray(val) && (!val[0] || !val[1])) {
            return {
              name: 'InvalidEventTime',
              message: `请选择${!val[0] ? '开始' : '结束'}时间`,
            };
          }
        },
        Form.createAsyncValidator((val: string[]) => {
          if (!val[0] || !val[1]) {
            return Promise.resolve({
              name: 'time',
              message: '请选择活动时间',
            });
          }

          const params: IValidateRangeParams = {
            command: {
              activityType: 'tuition',
              startAt: date.makeDateTimeStr(val[0]),
              endAt: date.makeDateTimeStr(val[1]),
            },
          };
          if (editType === 'edit') {
            params.command.excludeId = id;
          }

          return checkExistActivity(params).then(res => {
            if (res && res[0]) { // 暂定同一时间段内只允许存在一个同种类型的攒学费活动
              const { name } = res[0];
              return {
                name: 'duplicate-time',
                message: `该活动时间内已存在其他攒学费活动: "${name}"，请修改活动时间`,
              };
            }
          }).catch(err => ({
            name: 'time-error',
            message: err,
          }));
        })
      ],
    },
  ];
};

export default BaseInfo;
