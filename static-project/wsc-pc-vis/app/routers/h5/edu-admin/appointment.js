const routePrefix = '/v4/vis/h5/edu-admin/appointment';
const controllerPath = 'h5.edu-admin.AppointmentController';

module.exports = [
  [
    // 获取更新预约结果
    'GET',
    `${routePrefix}/getUpdateAppointmentResult.json`,
    controllerPath,
    'getUpdateAppointmentResult',
  ],
];
