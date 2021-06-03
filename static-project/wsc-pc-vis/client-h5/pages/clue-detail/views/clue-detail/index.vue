<template>
  <div class="container">
    <student-info
      v-if="isLoadClueDetail"
      :clue-id="clueId"
      :avatar="clueDetail.avatar"
      :name="clueDetail.name"
      :mobile="clueDetail.telephone"
      :sex="clueDetail.sex"
      :status="clueDetail.phase"
      :attributes="clueDetail.attributes"
      :revisit-time="clueDetail.revisitTime"
      :source="clueDetail.source"
    />
    <clue-tag
      v-if="isLoadClueDetail"
      :clue-id="clueId"
      :tags="clueDetail.tags"
    />
    <detail-assemblage
      v-if="isLoadClueDetail"
      :student-id="clueDetail.studentId"
      :clue-id="clueId"
      :name="clueDetail.name"
      :mobile="clueDetail.telephone"
    />
    <operation
      v-if="isLoadClueDetail"
      :clue-id="clueId"
      :attributes="clueDetail.attributes"
      :name="clueDetail.name"
      :mobile="clueDetail.telephone"
      :user-id="clueDetail.userId"
      :student-id="clueDetail.studentId"
      :student-name="clueDetail.name"
      :student-mobile="clueDetail.telephone"
      :owners="clueDetail.owners"
    />
    <next
      :clue-id="clueId"
    />
  </div>
</template>

<script>
import { Toast } from 'vant';
import Args from 'zan-utils/url/args';
import Operation from '../../components/operation.vue';
import Next from '../../components/next.vue';
import studentInfo from '../../containers/student-info.vue';
import clueTag from '../../containers/clue-tag.vue';
import detailAssemblage from '../../containers/detail-assemblage.vue';

const defaultAvatar = 'https://b.yzcdn.cn/public_files/2019/05/25/58b1e66dc2413282ad4d7a61c8d3d6d7.png';

export default {
  name: 'clue-detail',
  components: {
    'operation': Operation,
    'next': Next,
    'student-info': studentInfo,
    'clue-tag': clueTag,
    'detail-assemblage': detailAssemblage,
  },
  data() {
    return {
      isLoadClueDetail: false,
      clueDetail: {}, // 线索详情
      clueId: Number(Args.get('clueId')) || 0,
    };
  },
  mounted() {
    this.initClueDeatail();
    document.title = '线索详情';
  },
  methods: {
    initClueDeatail() {
      const clueId = this.clueId;
      this.$store.dispatch('clueDetailModule/getClueDetailById', { clueId })
        .then(res => {
          this.clueDetail.avatar = res.avatar || defaultAvatar; // 用户头像
          this.clueDetail.name = res.name || ''; // 用户姓名
          this.clueDetail.studentId = res.userId || 0; // 学员id
          this.clueDetail.telephone = res.telephone || ''; // 用户手机号
          this.clueDetail.sex = res.sex || ''; // 性别
          this.clueDetail.phase = res.phase || ''; // 跟进状态
          this.clueDetail.attributes = this.parseAttributes(res.attributes); // 资料项列表
          this.clueDetail.revisitTime = res.revisitTime || null; // 回访时间
          this.clueDetail.source = res.source || ''; // 线索来源
          this.clueDetail.tags = res.tags || []; // 线索标签列表
          if (res.source.regInfo) { // 报名详情
            this.clueDetail.source.regInfo = res.source.regInfo || [];
          }
          this.clueDetail.userId = res.userId || 0;
          this.clueDetail.source.courseName = res.source.courseName || ''; // 好友助力，公众号海报
          this.clueDetail.source.attendTime = res.source.attendTime || ''; // 体验课报名，意向时间
          this.clueDetail.source.attendAddress = res.source.attendAddress || ''; // 体验课报名，意向地点
          this.clueDetail.owners = res.owners;
          this.isLoadClueDetail = true;
        })
        .catch(err => {
          Toast(err);
        });
    },
    parseAttributes(attributes) {
      const parsedAttributes = [];
      attributes.forEach(attribute => {
        parsedAttributes.push(attribute);
      });

      return parsedAttributes;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  min-height: 100%;
}
</style>
