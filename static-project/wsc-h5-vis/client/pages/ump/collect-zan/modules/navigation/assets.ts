import { redirect } from '@/common/utils/custom-safe-link';

export function toMyPay() {
  redirect({
    url: '/wscvis/knowledge/index',
    query: {
      p: 'mypay',
      kdt_id: _global.kdt_id,
    },
  });
}
