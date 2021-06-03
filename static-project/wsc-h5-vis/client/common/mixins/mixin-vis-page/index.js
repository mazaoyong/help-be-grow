import setUser from './setters/set-user';
import setParams from './setters/set-params';
import setEnv from './setters/set-env';
import setLog from './setters/set-log';
import setSpm from './setters/set-spm';
import mixinDefaultConfig from './mixins/mixin-default-config';
import mixinForceRefresh from './mixins/mixin-force-refresh';
import mixinHasFixedButton from './mixins/mixin-has-fixed-button';
import mixinHideCopyRight from './mixins/mixin-hide-copy-right';
import mixinLog from './mixins/mixin-log';
import mixinPC from './mixins/mixin-pc';
import mixinTitle from './mixins/mixin-title';
import mixinProxy from './mixins/mixin-proxy';

export default {
  mixins: [
    mixinProxy,
    mixinDefaultConfig,
    mixinTitle,
    mixinPC,
    mixinLog,
    mixinForceRefresh,
    mixinHasFixedButton,
    mixinHideCopyRight,
  ],

  beforeCreate() {
    const { $options } = this;
    const { name = '' } = $options;
    console.group(name || '请设置组件名');

    setParams(this, $options);
    setUser(this);
    setEnv(this);
    setLog(this, $options);
  },

  beforeRouteLeave(to, from, next) {
    console.groupEnd(this.$options.name || '请设置组件名');
    if (!to.query.spm) return next(setSpm(to.fullPath));
    next();
  },
};

export { setDefaultConfig, setPageConfig } from './utils';
