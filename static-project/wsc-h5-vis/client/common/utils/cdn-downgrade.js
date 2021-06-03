export default function cdnDowngrade(origin, fallback = _global.url.imgqn) {
  if (!origin || !fallback) {
    return origin;
  }
  return String(origin).replace(/https?:\/\/img\.yzcdn\.cn/, fallback);
}
