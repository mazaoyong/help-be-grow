import { redirect } from '@/common/utils/custom-safe-link';

export function toCouponList() {
  redirect({
    url: '/wscump/coupon/collection',
    query: {
      kdt_id: _global.kdt_id,
    },
  });
}
