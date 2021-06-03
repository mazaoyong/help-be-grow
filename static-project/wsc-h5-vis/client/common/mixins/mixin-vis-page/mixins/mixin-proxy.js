import setMixinsProxy from '../setters/set-mixins-proxy';

export default {
  created() {
    this.$page = this;
    setMixinsProxy(this);
  },
};
