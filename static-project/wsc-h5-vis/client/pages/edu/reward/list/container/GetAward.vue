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
        :student-list="student.list"
        :checked-student="student.current"
        @confirmStudent="onConfirmStudent"
      />
    </van-actionsheet>
    <!-- 学员列表弹窗 结束 -->

    <van-actionsheet
      v-if="time.intentTime"
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
  </div>
</template>

<script>
import { Button, ActionSheet, Toast, DatetimePicker } from 'vant';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import Args from 'zan-utils/url/args';
import format from '@youzan/utils/date/formatDate';
import get from 'lodash/get';
import { getUserPosition } from '../../../utils';
import VisCard from '../../../../edu/components/card';
import VisLabel from '../../../../edu/components/label';
import StudentList from '../../../../edu/order-confirm/container/student-list';
import API from '../../../api';
import * as SafeLink from '@youzan/safe-link';

export default {
  name: 'get-award',
  components: {
    'vis-card': VisCard,
    'vis-label': VisLabel,
    'vis-student-list': StudentList,
    'van-button': Button,
    'van-actionsheet': ActionSheet,
    'van-datetime-picker': DatetimePicker,
  },
  mixins: [mixinVisPage],
  props: {},
  config: {
    title: '领取课程',
  },
  data() {
    return {
      visible: {
        student: false,
        time: false,
        address: false,
      },
      student: {
        list: [],
        name: '',
        phone: '',
        current: Args.get('checkedStudent') || '',
      },
      time: {
        intentTime: false,
        value: new Date(),
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
      cache: {
        student: {},
      },
      loading: false,
      studentList: [],
      checkedStudent: '',
      timer: null,
      kdtId: Args.get('kdt_id') || 0,
    };
  },
  computed: {
    stuContent() {
      return this.student.name ? `${this.student.name} ${this.student.phone}` : '选择学员';
    },
    timeContent() {
      return this.time.choosed ? format(this.time.value, 'YYYY-MM-DD HH:mm:ss') : '选择上课时间';
    },
    addressContent() {
      return this.address.selectedAddress || '选择上课地点';
    },
    recordId() {
      return this.$route.query.recordId || '';
    },
    addressTitle() {
      return `上课地点 (${this.address.addressList.length || 0})`;
    },
  },
  mounted() {
    if (this.student.current !== '') {
      this.getStudentDetail();
    }
    const courseAlias = Args.get('courseAlias');
    if (courseAlias) {
      API.getCourseTimeAddrByAlias(courseAlias)
        .then(res => {
          res.courseStartAt && (this.time.minDate = new Date(res.courseStartAt));
          res.courseEndAt && (this.time.maxDate = new Date(res.courseEndAt));
          this.time.intentTime = res.intentTime;
          this.address.storeIds = res.storeIds;
          this.address.intentAddress = res.intentAddress;
        })
        .catch(err => {
          Toast(err);
        });
    } else {
      Toast('获取课程信息失败');
    }
  },
  methods: {
    // 点击学员唤起学员弹窗
    onChooseStudent() {
      API.getStudentList().then(res => {
        const { data = [] } = res || {};
        this.student.list = data;
        if (this.student.list.length > 0) {
          this.visible.student = true;
        } else {
          SafeLink.redirect({
            url: `${origin}/wscvis/edu/student-edit.html?kdt_id=${this.kdtId}&callback_url=${encodeURIComponent(window.location.href)}`,
            kdtId: this.kdtId,
          });
        }
      }).catch(err => {
        this.student.list = [];
        SafeLink.redirect({
          url: `${origin}/wscvis/edu/student-edit.html?kdt_id=${this.kdtId}&callback_url=${encodeURIComponent(window.location.href)}`,
          kdtId: this.kdtId,
        });
        Toast(err);
      });
    },
    // 选择学员
    onConfirmStudent(alias) {
      this.student.current = String(alias) || '';
      this.getStudentDetail();
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
        alias: alias || this.student.current || '',
      })
        .then(res => {
          if (res && res.data) {
            const { data } = res;
            this.student.current = String(data.id) || '';
            this.student.name = data.name || '';
            this.student.phone = data.mobile || '';
            this.cache.student = data;

            this.$router.replace({
              name: 'RewardListGetAward',
              query: {
                ...this.$route.query,
                checkedStudent: this.student.current,
              },
            });

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
      this.time.value = time;
      this.time.choosed = true;
      this.visible.time = false;
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
        storeIds: this.address.storeIds || '[]', // 店铺id, 精确查找
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
      this.selectedAddress = item.name;
      this.selectedAddressId = item.id;
      this.address.addressList[index].isSelected = true;
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
          url: `${origin}/wscvis/edu/map?storeIds=${storeIds}&kdt_id=${this.kdtId}`,
          kdtId: this.kdtId,
        });
      }
    },
    submit() {
      if (this.loading) return;
      this.loading = true;
      API.redeemReward({
        presentedStudentId: this.student.current,
        rewardRecordId: this.recordId,
        courseAttendDTO: {
          courseTime: format(this.time.value, 'YYYY-MM-DD HH:mm:ss'),
          courseTimeStamp: this.time.value.getTime(),
          address: this.address.selectedAddress,
          addressId: this.address.selectedAddressId,
        },
      }).then(res => {
        const result = get(res, 'result');
        const success = get(res, 'success');
        if (success) {
          Toast({
            type: 'success',
            duration: 1000,
            forbidClick: true,
            message: result || '领取成功',
          });
          setTimeout(() => {
            this.$router.push({ name: 'RewardListActive' });
          }, 1500);
        } else {
          Toast(result || '领取失败，请重试');
        }
        this.loading = false;
      }).catch(err => {
        Toast(err);
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss">
.get-award {
  padding: 10px;
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
