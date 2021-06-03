export default function formatMoney(money) {
  if (money % 100 === 0) {
    return money / 100;
  } else if (money % 10 === 0) {
    return (money / 100).toFixed(1);
  } else {
    return (money / 100).toFixed(2);
  }
}
