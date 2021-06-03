module.exports = [
  ['GET', '/v4/vis/edu/page/settings/holiday', 'edu-admin.HolidayController', 'getIndexHtml'],

  ['GET', '/v4/vis/edu-admin/holiday/get-by-id.json', 'edu-admin.HolidayController', 'getHolidayById'],
  ['POST', '/v4/vis/edu-admin/holiday/create.json', 'edu-admin.HolidayController', 'createHoliday'],
  ['PUT', '/v4/vis/edu-admin/holiday/update.json', 'edu-admin.HolidayController', 'updateHoliday'],
  ['DELETE', '/v4/vis/edu-admin/holiday/delete.json', 'edu-admin.HolidayController', 'deleteHoliday'],
  ['GET', '/v4/vis/edu-admin/holiday/find-page.json', 'edu-admin.HolidayController', 'findHolidayPage'],
  ['GET', '/v4/vis/edu-admin/holiday/find.json', 'edu-admin.HolidayController', 'findHoliday'],

  ['GET', '/v4/vis/edu-admin/holiday/list-all-by-year.json', 'edu-admin.HolidayController', 'listAllNationalByYear'],
];
