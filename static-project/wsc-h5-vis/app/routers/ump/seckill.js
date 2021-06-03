module.exports = [
  [
    // 秒杀详情
    'GET',
    '/wscvis/seckill/info.json',
    'ump.SeckillController',
    'getInfo',
  ],
  [
    // 秒杀预约/提醒
    'POST',
    '/wscvis/seckill/appointment.json',
    'ump.SeckillController',
    'appointment',
  ],
];
