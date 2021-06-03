<template>
  <section>
    <vis-card
      v-if="time.intentTime || address.intentAddress"
      extend-style="padding: 0 12px;margin-bottom: 30px;"
    >
      <vis-label
        left-content="上课信息"
        no-right
        extend-left-style="font-size: 14px; font-weight: bold; color: #111;"
      />
      <vis-label
        v-if="time.intentTime"
        :right-content="timeContent"
        left-content="时间"
        show-arrow
        no-right
        @click="onChooseTime"
      />
      <vis-label
        v-if="address.intentAddress"
        :right-content="addressContent"
        left-content="地点"
        show-arrow
        no-right
        @click="onChooseAddress"
      />
    </vis-card>

    <!-- 时间选择 -->
    <van-actionsheet
      v-if="time.intentTime"
      v-model="visible.time"
    >
      <van-datetime-picker
        v-model="time.value"
        :min-date="time.minDate"
        :max-date="time.maxDate"
        @cancel="visible.time = false"
        @confirm="onConfirmTime"
      />
    </van-actionsheet>

    <!-- 地点选择 -->
    <van-actionsheet
      v-if="address.intentAddress"
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
  </section>
</template>
<script>
import Args from 'zan-utils/url/args';
import * as SafeLink from '@youzan/safe-link';
import format from '@youzan/utils/date/formatDate';
import { DatetimePicker, Toast, ActionSheet } from 'vant';

import VisCard from '../../../components/card';
import VisLabel from '../../../components/label';
import AddressItem from '../../../components/address-item';

import { getUserPosition } from '../../../utils';
import { isOfficialCourse } from '../../utils';
import API from '../../../api';

export default {
  name: 'course-info',

  components: {
    'vis-card': VisCard,
    'vis-label': VisLabel,
    'van-actionsheet': ActionSheet,
    'vis-address-item': AddressItem,
    'van-datetime-picker': DatetimePicker,
  },

  data() {
    return {
      time: {
        intentTime: false,
        value: null,
        minDate: new Date(),
        maxDate: undefined,
        choosed: false,
      },
      address: {
        intentAddress: false,
        selectedAddress: '',
        selectedAddressId: 0,
        storeIds: [],
        addressList: [],
        latitude: null,
        longitude: null,
      },
      visible: {
        time: false,
        address: false,
      },
      courseAlias: Args.get('courseAlias'),
      channel: Args.get('channel') || '',
      bizId: Args.get('bizId') || '',
    };
  },

  computed: {
    timeContent() {
      return this.time.choosed ? format(this.time.value, 'YYYY/MM/DD HH:mm:ss') : '选择上课时间';
    },
    addressContent() {
      return this.address.selectedAddress || '选择上课地点';
    },
    addressTitle() {
      return `上课地点 (${this.address.addressList.length || 0})`;
    },
  },

  mounted() {
    this.getCourseInfoByAlias();
  },

  methods: {
    getCourseInfoByAlias() {
      let getCourseTimeAddr = null;
      if (this.courseAlias) {
        getCourseTimeAddr = API.getCourseTimeAddrByAlias(this.courseAlias);
      } else if (this.bizId && this.channel) {
        getCourseTimeAddr = API.getCourseTimeAddr(this.bizId, this.channel);
      } else {
        Toast('获取课程信息失败');
      }

      if (getCourseTimeAddr) {
        getCourseTimeAddr
          .then(res => {
            res.courseStartAt && (this.time.minDate = new Date(format(res.courseStartAt, 'YYYY/MM/DD HH:mm:ss')));
            res.courseEndAt && (this.time.maxDate = new Date(format(res.courseEndAt, 'YYYY/MM/DD HH:mm:ss')));
            if (!isOfficialCourse(res.courseType)) {
              this.time.intentTime = res.intentTime;
            }
            this.address.intentAddress = res.intentAddress;
            this.address.storeIds = res.storeIds;
          })
          .catch(err => {
            Toast(err);
          });
      }
    },
    onChooseTime() {
      this.visible.time = true;
    },
    onConfirmTime(time) {
      this.time.value = time;
      this.time.choosed = true;
      this.visible.time = false;
      this.$emit('select-time', this.time);
    },
    onChooseAddress() {
      if (this.address.addressList && this.address.addressList.length > 0) {
        this.visible.address = true;
        return;
      }
      if (!this.address.latitude || !this.address.longitude) {
        getUserPosition()
          .then(res => {
            this.address.latitude = res.latitude || null;
            this.address.longitude = res.longitude || null;
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
        latitude: this.address.latitude, // 纬度
        longitude: this.address.longitude, // 经度
        storeIds: JSON.stringify(this.address.storeIds), // 店铺id, 精确查找
      };
      API.getAddressList(data)
        .then(res => {
          if (res && res.data && res.data.length > 0) {
            const { data } = res;
            this.address.addressList = data.map((item, index) => {
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
            Toast((res && res.msg) || '获取地址列表失败，请重试');
          }
        })
        .catch(() => {
          Toast('获取地址列表失败，请重试');
        });
    },
    onSelectAddress(item, index) {
      this.address.addressList.forEach(item => {
        item.isSelected = false;
      });
      this.address.selectedAddress = item.name;
      this.address.selectedAddressId = item.id;
      this.address.addressList[index].isSelected = true;
      this.$emit('select-address', this.address);
      this.$set(this.address.addressList, index, this.address.addressList[index]);
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
          url: `${origin}/wscvis/edu/map?storeIds=${storeIds}&kdt_id=${Args.get('kdtId')}`,
          kdtId: Args.get('kdtId'),
        });
      }
    },
  },
};
</script>
<style lang="scss">
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
