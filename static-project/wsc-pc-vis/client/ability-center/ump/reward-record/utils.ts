export function getUuid() {
  return Date.now() + Math.ceil(Math.random() * 1000);
}
