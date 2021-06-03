<template>
  <vis-page-container>
    <div class="address-list-container">
      <div
        v-if="count"
        class="count"
      >
        共{{ count }}个
      </div>
      <div class="address-item-box">
        <div
          v-for="item in addressList"
          :key="item.id"
          @click="addressItemClick(item, $event)"
        >
          <vis-address-item
            :address="item.name"
            :distance="item.distanceStr"
            :detail="`${item.province}${item.city}${item.district}${item.address}`"
          />
        </div>
      </div>
    </div>
  </vis-page-container>
</template>

<script>
import API from '../api';
import Args from 'zan-utils/url/args';
import AddressItem from '../components/address-item';
import PageContainer from '../components/page-container';
import * as SafeLink from '@youzan/safe-link';

export default {
  name: 'app',
  components: {
    'vis-page-container': PageContainer,
    'vis-address-item': AddressItem,
  },
  data() {
    return {
      addressList: [],
      kdtId: Args.get('kdt_id') || 0, // 获取kdtId
      count: 0,
    };
  },
  created() {
    this.initPage();
  },
  methods: {
    initPage() {
      const data = {
        latitude: Number(Args.get('latitude')) || null, // 纬度
        longitude: Number(Args.get('longitude')) || null, // 经度
        storeIds: Args.get('storeIds') || '[]', // 店铺id, 精确查找
      };
      API.getAddressList(data)
        .then(res => {
          if (res && res.data && res.data.length > 0) {
            this.addressList = res.data.map((item, index) => {
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
            this.count = this.addressList.length || 0;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addressItemClick(item, $event) {
      window.event ? window.event.cancelBubble = true : $event.stopPropagation();
      const id = item.id || null;
      if (id) {
        const storeIds = JSON.stringify([id]);
        const reUrl = `/wscvis/edu/map?storeIds=${storeIds}&kdt_id=${this.kdtId}`;
        SafeLink.redirect({
          url: reUrl,
          kdtId: this.kdtId,
        });
      }
    },
  },
};
</script>

<style lang="scss">
.address-list-container {
  background-color: #fff;
  .count {
    padding-left: 15px;
    height: 36px;
    line-height: 36px;
    font-size: 13px;
    color: #666;
    background-color: #f8f8f8;
  }
  .address-item-box {
    padding: 0 15px 0 20px;
  }
}
</style>
