import { redirect } from '@/common/utils/custom-safe-link';

export function toHome() {
  redirect({
    url: '/wscshop/showcase/homepage',
    query: {
      kdt_id: _global.kdt_id,
    },
  });
}
