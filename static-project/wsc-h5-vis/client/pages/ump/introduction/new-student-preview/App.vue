<template>
  <vis-page-container>
    <section v-if="data.posterStyle" :class="['new-student-content', `new-student-content-style-${data.posterStyle}`]">
      <header-info :data="data" />
      <reward-info :data="data" />
      <reward-list :newStudentRewardSetting="data.newStudentRewardSetting" />
      <insti-intro :constitutionDesc="data.constitutionDesc" />
    </section>
  </vis-page-container>
</template>

<script>
import PageContainer from '@/pages/edu/components/page-container';
import HeaderInfo from './blocks/header-info';
import RewardInfo from './blocks/reward-info';
import RewardList from './blocks/reward-list';
import InstiIntro from './blocks/insti-intro';

export default {
  name: 'new-student',
  data() {
    return {
      data: {},
    };
  },
  components: {
    'vis-page-container': PageContainer,
    HeaderInfo,
    RewardInfo,
    RewardList,
    InstiIntro,
  },
  mounted() {
    parent.postMessage('introduction-preview', '*');
    window.addEventListener('message', (event) => {
      if (event.data && event.data.posterStyle) {
        this.data = event.data;
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.new-student-content {
  height: auto;
  min-height: 680px;
  transform: scale(0.85);
  transform-origin: 0% 0%;
  padding-bottom: 16px;
  background-repeat: no-repeat;
  background-size: 100% auto;

  &:before {
    position: fixed;
    display: block;
    content: '';
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
  }

  &-style-1 {
    background-color: #e0a567;
    background-image: url('https://img01.yzcdn.cn/public_files/df417290be627a10e72bc9bb4779c722.png');
  }

  &-style-2 {
    background-color: #952c00;
    background-image: url('https://img01.yzcdn.cn/public_files/70965a56c973491f73e386aa327888d1.png');
  }

  &-style-3 {
    background-color: #95c14a;
    background-image: url('https://img01.yzcdn.cn/public_files/392461b516c790e7945309a575e5a9ed.png');
  }
}
</style>
