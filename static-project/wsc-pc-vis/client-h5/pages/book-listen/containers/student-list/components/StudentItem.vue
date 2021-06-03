<template>
  <div class="student-item-wrap" @click="onSelect">
    <div class="student-item-wrap__left">
      <span class="student-item-wrap__img">
        <img :src="avatar || 'https://b.yzcdn.cn/public_files/2019/05/25/58b1e66dc2413282ad4d7a61c8d3d6d7.png'">
      </span>
      <span class="student-item-wrap__name">
        {{ name }}
      </span>
      <span class="student-item-wrap__mobile">
        {{ mobile }}
      </span>
    </div>

    <span class="student-item-wrap__check">
      <van-icon
        v-if="isChecked"
        name="success"
        size="14px"
        color="#00b987"
      />
    </span>
  </div>
</template>

<script>
import { Icon } from 'vant';
export default {
  name: 'student-item',

  components: {
    'van-icon': Icon,
  },

  props: {
    studentId: {
      type: Number,
      default: 0,
    },

    avatar: {
      type: String,
      default: 'https://b.yzcdn.cn/public_files/2019/05/25/58b1e66dc2413282ad4d7a61c8d3d6d7.png',
    },
    name: {
      type: String,
      default: '',
    },
    mobile: {
      type: String,
      default: '',
    },
    selectedId: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    isChecked() {
      return this.studentId === this.selectedId;
    },
  },

  methods: {
    onSelect() {
      this.$emit('selectStu', this.studentId);
    },
  },
};
</script>

<style lang="postcss">
  .student-item-wrap {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    line-height: 22px;
    padding: 13px 15px;
    font-size: 16px;
    color: #646566;

    &__left {
      display: inline-flex;
      WIDTH: 90%;
      align-items: center;
    }

    &__img {
      margin-right: 10px;

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }

    &__name {
      margin-right: 5px;
      color: #323233;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
      width: 40%;
    }

    &__check {
      display: inline-block;
      width: 20px;
      margin-left: 5px;
      text-align: right;
    }
  }
</style>
