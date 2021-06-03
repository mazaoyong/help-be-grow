module.exports = [
  ['GET', '/v4/vis/edu/page/settings', 'edu-admin.SettingsController', 'getIndexHtml'],
  ['POST', '/v4/vis/edu/settings.json', 'edu-admin.SettingsController', 'createEduConfig'],
  ['PUT', '/v4/vis/edu/settings.json', 'edu-admin.SettingsController', 'updateEduConfig'],
  ['GET', '/v4/vis/edu/settings.json', 'edu-admin.SettingsController', 'getEduConfig'],
  ['GET', '/v4/vis/edu/getAppointmentConfig.json', 'edu-admin.SettingsController', 'getAppointmentConfig'],
  ['GET', '/v4/vis/edu/isShopAppointmentConfigIndependent.json', 'edu-admin.SettingsController', 'isShopAppointmentConfigIndependent'],
  ['POST', '/v4/vis/edu/updateAppointmentConfig.json', 'edu-admin.SettingsController', 'updateAppointmentConfig'],

  ['GET', '/v4/vis/edu/page/settings/eliminate', 'edu-admin.SettingsController', 'getIndexHtml'],
];
