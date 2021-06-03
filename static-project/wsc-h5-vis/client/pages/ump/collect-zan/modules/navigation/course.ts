import { redirect } from '@/common/utils/custom-safe-link';

const kdtId = _global.kdt_id;

export function toCourse(alias: string) {
  redirect({
    url: `/wscvis/course/detail/${alias}`,
    query: {
      kdt_id: kdtId,
    },
  });
}

export function toGetCourse(id: number, alias: string, type: number) {
  redirect({
    url: `/wscvis/edu/get-course`,
    query: {
      kdt_id: kdtId,
      alias,
      type,
      channel: 'collectZan',
      bizId: id,
      redirectUrl: `/wscvis/knowledge/index?page=mypay&kdt_id=${kdtId}`,
    },
  });
}
