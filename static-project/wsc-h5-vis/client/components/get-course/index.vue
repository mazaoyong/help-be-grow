<template>
  <div class="get-award">
    <vis-card extend-style="padding: 0 12px;margin-bottom: 10px;">
      <vis-label
        left-content="学员信息"
        no-right
        extend-left-style="font-size: 14px; font-weight: bold; color: #111;"
      />
      <vis-label
        :right-content="stuContent"
        left-content="学员"
        show-arrow
        no-right
        @click="onChooseStudent"
      />
    </vis-card>
    <vis-card
      v-if="time || address"
      extend-style="padding: 0 12px;margin-bottom: 30px;"
    >
      <vis-label
        left-content="上课信息"
        no-right
        extend-left-style="font-size: 14px; font-weight: bold; color: #111;"
      />
      <vis-label
        v-if="time"
        :right-content="timeContent"
        left-content="时间"
        show-arrow
        no-right
        @click="onChooseTime"
      />
      <vis-label
        v-if="address"
        :right-content="addressContent"
        left-content="地点"
        show-arrow
        no-right
        @click="onChooseAddress"
      />
    </vis-card>
    <van-button
      class="get-award__btn"
      type="primary"
      size="large"
      round
      @click="submit"
    >
      领取免费课程
    </van-button>

    <!-- 学员列表弹窗 开始 -->
    <van-actionsheet
      v-model="visible.student"
      title="选择学员"
    >
      <vis-student-list
        :student-list="studentData.list"
        :checked-student="studentData.selected && studentData.selected.alias"
        @confirmStudent="onConfirmStudent"
      />
    </van-actionsheet>
    <!-- 学员列表弹窗 结束 -->

    <van-actionsheet
      v-if="time"
      v-model="visible.time"
    >
      <van-datetime-picker
        v-model="time.value"
        :min-date="time.minDate"
        :max-date="time.maxDate"
        @confirm="onConfirmTime"
      />
    </van-actionsheet>

    <van-actionsheet
      v-if="address"
      v-model="visible.address"
      :title="addressTitle"
    >
      <div
        v-for="(item, index) in address.addressList"
        :key="item.id"
        :class="item.isSelected ? 'address-item-box-active' : ''"
        class="address-item-box"
        @click="onSelectAddress(item, index)"
      >
        <vis-address-item
          :address="item.name"
          :distance="item.distanceStr"
          :detail="`${item.province}${item.city}${item.district}${item.address}`"
          @click="onAddressItemClick(item, $event)"
        />
        <span class="address-radio">
          <img
            v-if="item.isSelected"
            src="https://b.yzcdn.cn/public_files/2018/11/27/ec2af9e485510cd839d7b2d519b3c44c.png"
          >
        </span>
      </div>
    </van-actionsheet>
  </div>
</template>

<script>
import { Button, ActionSheet, Toast, DatetimePicker } from 'vant';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import Args from 'zan-utils/url/args';
import format from '@youzan/utils/date/formatDate';
import * as SafeLink from '@youzan/safe-link';

// 枯了，没时间迁移。。。
import { getUserPosition } from '../../pages/edu/utils';
import VisCard from '../../pages/edu/components/card';
import VisLabel from '../../pages/edu/components/label';
import AddressItem from '../../pages/edu/components/address-item';
import StudentList from '../../pages/edu/order-confirm/container/student-list';
import * as API from './api';

const kdtId = _global.kdt_id || 0;

export default {
  name: 'get-course',

  components: {
    'vis-card': VisCard,
    'vis-label': VisLabel,
    'vis-student-list': StudentList,
    'vis-address-item': AddressItem,
    'van-button': Button,
    'van-actionsheet': ActionSheet,
    'van-datetime-picker': DatetimePicker,
  },

  mixins: [mixinVisPage],

  props: {
    time: {
      type: Boolean,
      default: false,
    },
    address: {
      type: Boolean,
      default: false,
    },
    onSubmit: {
      type: Function,
      default: Promise.resolve(),
    },
  },

  data() {
    return {
      visible: {
        student: false,
        time: false,
        address: false,
      },
      studentData: {
        list: [],
        selected: null,
      },
      timeData: {
        selected: null,
        minDate: new Date(),
        maxDate: null,
      },
      addressData: {
        list: [],
        selected: null,
        storeIds: [],
        latitude: null,
        longitude: null,
      },
      loading: false,
    };
  },

  computed: {
    stuContent() {
      if (this.studentData.selected) {
        return `${this.studentData.selected.name} ${this.studentData.selected.mobile}`;
      }
      return '选择学员';
    },
    timeContent() {
      if (this.timeData.selected) {
        return format(this.timeData.selected, 'YYYY-MM-DD HH:mm:ss');
      }
      return '选择上课时间';
    },
    addressContent() {
      if (this.addressData.selected) {
        return this.addressData.selected.name;
      }
      return '选择上课地点';
    },
    addressTitle() {
      return `上课地点 (${this.addressData.list.length || 0})`;
    },
  },

  mounted() {
    const checkedStudent = Args.get('checkedStudent');
    if (checkedStudent) {
      this.getStudentDetail(checkedStudent);
    }
  },

  methods: {
    // 点击学员唤起学员弹窗
    onChooseStudent() {
      API.getStudentList().then(data => {
        this.studentData.list = data;
        if (data.length > 0) {
          this.visible.student = true;
        } else {
          SafeLink.redirect({
            url: `${origin}/wscvis/edu/student-edit.html?kdt_id=${kdtId}`,
            kdtId,
          });
        }
      }).catch(err => {
        this.studentData.list = [];
        SafeLink.redirect({
          url: `${origin}/wscvis/edu/student-edit.html?kdt_id=${kdtId}`,
          kdtId,
        });
        Toast(err);
      });
    },

    // 选择学员
    onConfirmStudent(alias) {
      this.getStudentDetail(alias);
      setTimeout(() => {
        this.visible.student = false;
      }, 500);
    },

    // 获取学员详情
    getStudentDetail(alias) {
      const loadingToastInst = Toast.loading({
        duration: 0,
        forbidClick: true,
        message: '加载中...',
      });
      API.getStudentDetail({
        alias,
      })
        .then(data => {
          if (data) {
            this.studentData.selected = data;
            loadingToastInst.clear();
          }
        })
        .catch(err => {
          loadingToastInst.clear();
          Toast(err);
        });
    },

    onChooseTime() {
      this.visible.time = true;
    },

    onConfirmTime(time) {
      this.timeData.selected = time;
      this.visible.time = false;
    },

    onChooseAddress() {
      if (this.addressData.list.length > 0) {
        this.visible.address = true;
        return;
      }
      if (!this.addressData.latitude || !this.addressData.longitude) {
        getUserPosition()
          .then(res => {
            this.addressData.latitude = res.latitude || null;
            this.addressData.longitude = res.longitude || null;
            this.getAddressList(); // 获取地址列表
          })
          .catch(() => {
            this.getAddressList(); // 获取地址列表
          });
      } else {
        this.getAddressList(); // 获取地址列表
      }
    },

    getAddressList() {
      const data = {
        latitude: this.addressData.latitude, // 纬度
        longitude: this.addressData.longitude, // 经度
        storeIds: JSON.stringify(this.addressData.storeIds), // 店铺id, 精确查找
      };
      API.getAddressList(data)
        .then(data => {
          if (data && data.length > 0) {
            this.addressData.list = data.map((item, index) => {
              if (item.distance) {
                if (item.distance >= 1000) {
                  item.distanceStr = `距我${parseFloat(item.distance / 1000)}km`;
                } else {
                  item.distanceStr = `距我${item.distance}m`;
                }

                if (index === 0) {
                  item.distanceStr = `${item.distanceStr} 离我最近`;
                }
              }
              item.province = item.addressWrapDTO.province || '';
              item.city = item.addressWrapDTO.city || '';
              item.district = item.addressWrapDTO.district || '';
              item.address = item.addressWrapDTO.address || '';

              return item;
            });
            // 如果只有一条地址, 默认选中
            if (data.length === 1) {
              data[0].isSelected = true;
            }
            this.visible.address = true;
          } else {
            Toast('获取地址列表失败，请重试');
          }
        })
        .catch(() => {
          Toast('获取地址列表失败，请重试');
        });
    },

    onSelectAddress(item, index) {
      this.addressData.list.forEach(item => {
        item.isSelected = false;
      });
      this.addressData.selected = item;
      this.addressData.list[index].isSelected = true;
      this.$set(this.addressData.list, index, this.addressData.list[index]);
      this.$forceUpdate();
      setTimeout(() => {
        this.visible.address = false;
      }, 500);
    },

    // 点击地址列表弹窗的具体地址，跳转到地图页面
    onAddressItemClick(item, $event) {
      window.event ? window.event.cancelBubble = true : $event.stopPropagation();
      const id = item.id || null;
      if (id) {
        const storeIds = JSON.stringify([id]);
        SafeLink.redirect({
          url: `${origin}/wscvis/edu/map?storeIds=${storeIds}&kdt_id=${kdtId}`,
          kdtId,
        });
      }
    },

    submit() {
      if (this.loading) return;
      if (!this.studentData.selected) {
        Toast('请选择学员');
        return;
      }
      if (this.time && !this.timeData.selected) {
        Toast('请选择意向上课时间');
        return;
      }
      if (this.address && !this.addressData.selected) {
        Toast('请选择意向上课地点');
        return;
      }
      this.loading = true;
      const data = {
        student: this.studentData.selected,
      };
      if (this.time) {
        data.time = this.timeData.selected;
      }
      if (this.address) {
        data.address = this.addressData.selected;
      }
      const handle = this.onSubmit(data);
      if (handle instanceof Promise) {
        handle.finally(() => {
          this.loading = false;
        });
      }
    },
  },
};
</script>

<style lang="scss">
.get-award {
  padding: 10px;
  .vis-label {
    &:last-child{
      border-bottom: none;
    }
  }
  .vis-card {
    margin: 0;
    margin-bottom: 20px;
  }
  &__btn {
    height: 44px;
    line-height: 44px;
    border: 0;
  }
}
.address-item-box {
  position: relative;
  padding: 0 60px 0 20px;
  &-active {
    .address-radio {
      background-image: url('https://b.yzcdn.cn/public_files/2018/11/27/ec2af9e485510cd839d7b2d519b3c44c.png');
    }
  }
  .vis-address-item {
    padding: 15px 0 5px;
  }
  .address-radio {
    box-sizing: border-box;
    display: block;
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translate(0, -50%);
    width: 20px;
    height: 20px;
    border: 1px solid #f0f0f0;
    border-radius: 10px;
    img {
      display: block;
      width: 18px;
      height: 20px;
    }
  }
}
</style>
