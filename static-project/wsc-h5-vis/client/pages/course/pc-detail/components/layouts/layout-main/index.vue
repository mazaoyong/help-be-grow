<script lang="jsx">
import { Skeleton as VanSkeleton } from 'vant';
import BlockActions from '../../../blocks/block-actions';

export default {
  name: 'layout-main',

  components: {
    VanSkeleton,
    BlockActions,
  },

  render(h) {
    const cover = this.$slots.default[0];

    return (
      <div class="layout-main">
        <div class="layout-main__content">
          { cover ? [cover] : <van-skeleton avatar avatar-shape="square" /> }

          <div class="layout-main__base-info">
            { this.$slots.default.slice(1, 2) }

            <block-actions />
          </div>

          { this.$slots.default.slice(2) }
        </div>
      </div>
    );
  },
};
</script>

<style lang="scss">
.layout-main {
  height: 276px;
  padding: 24px;
  margin: 16px 0;
  background: #fff;
  box-sizing: border-box;

  &__content {
    display: flex;
    height: 100%;
  }

  &__base-info {
    display: flex;
    height: 100%;
    margin-left: 32px;
    flex-direction: column;

    > div:first-child {
      flex: 1 1 auto;
    }

    > div:last-child {
      flex: 0 0 auto;
    }
  }

  .van-skeleton__avatar {
    width: 402px !important;
    height: 228px !important;
  }
}
</style>
