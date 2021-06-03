<template>
  <store-map
    :storeIds="storeIds"
    :longitude="longitude"
    :latitude="latitude"
    :province="province"
    :city="city"
    :district="district"
    :address="address"
    :name="name"
    :use-local-address="useLocalAddress"
  />
</template>

<script>
import Args from 'zan-utils/url/args';
import StoreMap from 'components/store-map';

export default {
  name: 'app',
  components: {
    'store-map': StoreMap,
  },
  data() {
    const storeIds = Args.get('storeIds');

    return {
      useLocalAddress: !storeIds,
      storeIds: storeIds || '[]',
      longitude: Args.get('longitude') || '',
      latitude: Args.get('latitude') || '',
      province: Args.get('province') || '',
      city: Args.get('city') || '',
      district: Args.get('district') || '',
      address: Args.get('address') || '',
      name: Args.get('name') || '',
    };
  },
};
</script>
