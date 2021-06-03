<template>
  <div class="delete-popup">
    <div class="delete-popup__content">
      <div>·查看学员的课程、课表、证书。</div>
      <div>·帮学员约课、签到、修改资料。</div>
    </div>
    <div class="delete-popup__del">
      确定删除？
    </div>
  </div>
</template>
<script>
export default {
  name: 'delete-popup',
};
</script>
<style lang="scss">
.delete-popup {
  &__content {
    margin-bottom: 24px;
    font-size: 14px;
    line-height: 18px;
    color: #646566;
  }

  &__del {
    font-size: 14px;
    font-weight: bold;
    color: #323233;
  }
}
</style>
