<template>
  <card
    v-if="Object.keys(signupDetailData).length > 0 && signupDetailData.regInfo.length > 0"
    class="signup-detail"
  >
    <attribute-item
      v-for="(attribute, index) in signupDetailData.regInfo"
      :key="index"
      type="before"
      :attributeKey="attribute.attributeKey"
      :attributeTitle="attribute.attributeTitle"
      :attributeValue="attribute.attributeValue"
    />
  </card>
</template>

<script>
import Card from 'components/card/index.vue';
import AttributeItem from './components/attribute-item.vue';

export default {
  name: 'signup-detail',
  components: {
    'card': Card,
    'attribute-item': AttributeItem,
  },
  data() {
    return {
      signupDetailData: {},
      date: '',
      week: '',
    };
  },
  mounted() {
    this.signupDetailData = this.$store.getters['clueDetailModule/signupDetailData'] || {};
  },
};
</script>

<style lang="scss" scoped>
.signup-detail {
  padding: 8px 15px;
}
</style>
