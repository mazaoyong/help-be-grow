module.exports = [
  [
    'GET',
    '/v4/vis/h5/supv/homework/getAssignment.json',
    'h5.supv.homework.AssignmentController',
    'getAssignment',
  ],
  [
    'POST',
    '/v4/vis/h5/supv/homework/review.json',
    'h5.supv.homework.AssignmentController',
    'review',
  ],
  [
    'GET',
    '/v4/vis/h5/supv/homework/assignmentSort.json',
    'h5.supv.homework.AssignmentController',
    'assignmentSort',
  ],
  [
    'GET',
    '/v4/vis/h5/supv/homework/findHomeworkAssignmentPage.json',
    'h5.supv.homework.AssignmentController',
    'findHomeworkAssignmentPage',
  ],
  [
    'GET',
    '/v4/vis/h5/supv/homework/findLatestComment.json',
    'h5.supv.homework.AssignmentController',
    'findLatestComment',
  ],
];