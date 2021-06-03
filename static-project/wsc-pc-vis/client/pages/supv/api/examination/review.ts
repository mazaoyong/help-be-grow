// import { visAjax } from 'fns/new-ajax';

export function findByReview(query) {
  /* return visAjax('GET', '/supv/examtion/findByReview.json', {
      pageRequest,
    }); */
  console.log(query);
  return new Promise((resolve) =>
    resolve({
      'totalCount': 5,
      'reviewedCount': 2,
      'notReviewCount': 3,
      'reviewPage': {
        'content': new Array(10).fill(0).map(
          (_, idx) => (
            {
              'status': idx % 2,
              'answerPaperId': idx,
              'reviewer': {
                'role': 0,
                'userId': 111,
                'mobile': '133 **** 6666',
                'avatar': 'https://cas.qima-inc.com/public/users/avatar/zhengjian?v=1590729678838',
                'kdtId': 6083707,
                'name': `郑健-${idx}`
              },
              'examUser': {
                'role': 0,
                'userId': 111,
                'mobile': '133 **** 6666',
                'avatar': 'https://cas.qima-inc.com/public/users/avatar/zhengjian?v=1590729678838',
                'kdtId': 6083707,
                'name': '郑健'
              },
              'score': Math.round(Math.random() * 10),
              'submitTime': 1590730360000
            }
          )
        ),
        'total': 5
      },
    }
    ),
  );
}
