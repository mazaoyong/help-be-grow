<template>
  <div
    class="change-list"
  >
    <common-list
      :params="params"
      :request="request"
      immediate-check
      error-text="请求失败，点击重新加载"
    >
      <template slot-scope="props">
        <change-item
          :item="props.item"
          :operation-type="operationType"
          @click.native="onChangeDetail(props.index)"
        />
      </template>
      <div slot="empty">
        还没有相关内容哦
      </div>
    </common-list>
  </div>
</template>

<script>
import api from '../api';
import Args from 'zan-utils/url/args';
import { CommonList } from '@youzan/vis-ui';
import ChangeItem from './components/change-item';

export default {
  name: 'change-list',

  components: {
    ChangeItem,
    CommonList,
  },

  data() {
    return {
      changeList: [],
      assetNo: Args.get('assetNo'),
      studentId: parseInt(Args.get('studentId')),
      operationType: parseInt(Args.get('operationType')),
    };
  },
  computed: {
    params() {
      return {
        assetNo: this.assetNo,
        studentId: this.studentId,
        operationOriginType: this.operationType,
      };
    },
  },
  methods: {
    // 获取课程变更明细列表数据接口
    request(params) {
      return api.queryAssetOperationPage(params)
        .then(data => {
          this.changeList.push(...data.content);
          this.$store.commit('UPDATE_LIST', this.changeList);
          this.$store.commit('UPDATE_TYPE', this.operationType);
          return {
            list: data.content,
            hasNext: params.page < data.totalPages,
          };
        });
    },

    // 跳转到单个课程资产变更明细页详情
    onChangeDetail(index) {
      this.$router.push({
        path: `/changedetail/${index}/${this.operationType}`,
      });
    },
  },
};
</script>
