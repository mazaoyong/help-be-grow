import get from 'lodash/get';
import { Toast } from 'vant';
import Args from 'zan-utils/url/args';
import * as SafeLink from '@youzan/safe-link';
import format from '@youzan/utils/date/formatDate';

import API from '../../api';

export default {
  name: 'courseMixin',

  data() {
    return {
      channel: Args.get('channel') || '',
      bizId: Args.get('bizId') || '',
    };
  },
  methods: {
    submitCourseReward(ctx) {
      if (ctx.loading) return;
      if (!ctx.student.current) {
        Toast('请选择学员');
        return;
      }
      if (ctx.time.intentTime && !ctx.time.value) {
        Toast('请选择意向上课时间');
        return;
      }
      if (ctx.address.intentAddress && !ctx.address.selectedAddressId) {
        Toast('请选择意向上课地点');
        return;
      }
      ctx.loading = true;
      const courseAttend = {};
      let request = null;
      if (ctx.time.intentTime) {
        courseAttend.courseTime = format(ctx.time.value, 'YYYY/MM/DD HH:mm:ss');
        courseAttend.courseTimeStamp = ctx.time.value.getTime();
      }
      if (ctx.address.intentAddress) {
        courseAttend.address = ctx.address.selectedAddress;
        courseAttend.addressId = ctx.address.selectedAddressId;
      }
      if (ctx.channel && ctx.bizId) {
        request = API.postRewardCourse({
          channel: ctx.channel,
          bizId: ctx.bizId,
          student: {
            name: ctx.student.name,
            phoneNumber: ctx.student.phone,
            id: ctx.student.current,
            courseAttend,
          },
        });
      } else if (ctx.recordId) {
        request = API.redeemReward({
          presentedStudentId: ctx.student.current,
          rewardRecordId: ctx.recordId,
          courseAttendDTO: courseAttend,
        });
      }
      if (request) {
        request.then(res => {
          const result = get(res, 'result');
          const success = get(res, 'success') || res === true;
          if (success) {
            Toast({
              type: 'success',
              duration: 1000,
              forbidClick: true,
              message: result || '领取成功',
            });
            setTimeout(() => {
              const redirectUrl = Args.get('redirectUrl') || '';
              if (redirectUrl) {
                SafeLink.redirect({
                  url: redirectUrl,
                });
              }
            }, 1500);
          } else {
            Toast(result || '领取失败，请重试');
          }
          ctx.loading = false;
        }).catch(err => {
          Toast(err);
          ctx.loading = false;
        });
      } else {
        Toast('课程领取失败');
        ctx.loading = false;
      }
    },
  },
};
