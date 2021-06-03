import { visAjax } from 'fns/new-ajax';

export async function getContentSubscriptionCount(alias: string) {
  return visAjax('GET', '/pct/content/subscriptionCount.json', { alias });
}

export async function getColumnSubscriptionCount(alias: string) {
  return visAjax('GET', '/course/column/subscriptionCount.json', { alias });
}

export async function getLiveSubscriptionCount(alias: string) {
  return visAjax('GET', '/course/live/subscriptionCount.json', { alias });
}
