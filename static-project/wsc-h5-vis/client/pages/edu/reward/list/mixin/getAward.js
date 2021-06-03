import Args from 'zan-utils/url/args';
import * as SafeLink from '@youzan/safe-link';

export default {
  methods: {
    getAward(type) {
      switch (type) {
        case 'TICKET':
          this.$emit('takeReward');
          break;
        case 'COURSE':
          if (this.type === 'formally') {
            this.$emit('takeReward');
          } else {
            const reUrl = Args.add('/wscvis/edu/get-course', {
              kdtId: this.kdtId,
              recordId: this.recordId,
              courseAlias: this.alias,
              redirectUrl: window.location.href,
            });
            SafeLink.redirect({
              url: reUrl,
              kdtId: this.kdtId,
            });
          }
          break;
        case 'POINT':
          this.$emit('takeReward');
          break;
        default:
      }
    },
  },
};
