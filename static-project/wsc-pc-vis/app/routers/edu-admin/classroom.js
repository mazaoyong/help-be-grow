module.exports = [
  ['GET', '/v4/vis/edu/page/classroom', 'edu-admin.ClassRoomController', 'getIndexHtml'],
  ['POST', '/v4/vis/edu/classroom.json', 'edu-admin.ClassRoomController', 'createClassroom'],
  ['PUT', '/v4/vis/edu/classroom.json', 'edu-admin.ClassRoomController', 'updateClassroom'],
  ['DELETE', '/v4/vis/edu/classroom.json', 'edu-admin.ClassRoomController', 'deleteClassroom'],
  ['GET', '/v4/vis/edu/classroom.json', 'edu-admin.ClassRoomController', 'getClassroomById'],
  ['GET', '/v4/vis/edu/classroomNo.json', 'edu-admin.ClassRoomController', 'getClassroomByNo'],
  ['GET', '/v4/vis/edu/classrooms.json', 'edu-admin.ClassRoomController', 'findPageByCondition'],
];
