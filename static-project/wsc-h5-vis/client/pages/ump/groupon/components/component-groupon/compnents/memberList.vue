<template>
  <div class="member-list">
    <div class="member-list__title">
      参团好友
    </div>
    <div class="member-list__list">
      <join-list
        :fetch-promise="fetchMember"
        :params="params"
        activity-type="groupon"
      />
    </div>
  </div>
</template>

<script>
import { List, Tag } from 'vant';
import { mapState } from 'vuex';
import JoinList from '../../../../components/join-list';

export default {
  name: 'member-list',

  components: {
    [List.name]: List,
    [Tag.name]: Tag,
    JoinList,
  },

  data() {
    return {
      page: 1,
      pageSize: 10,
      list: [],
      finished: false,
      loading: false,
    };
  },

  computed: {
    ...mapState([
      'params',
    ]),
  },

  methods: {
    fetchMember() {
      return this.$store.dispatch('fetchMember');
    },
  },
};
</script>

<style lang="scss" scoped>
.member-list {
  padding: 15px;
  margin-top: 10px;
  background-color: #fff;
  border-radius: 6px;
}
</style>
