/**
 * 重新组装某一条评价信息
 * 返回组装后的某一条评价信息的各部分内容
 *
 * @param {Object}  item             接口返回的某条评价的信息
 * @param {Object}  options          配置选项
 * @param {boolean} options.isDetail true: 提取该条评价的详细详细, false: 提取该条评价的简要信息
 */
function formatEvaluationData(item, options = {}) {
  if (item.length > 0) {
    const { evaluationAlias = '' } = item[0];
    let buyerReview = null;
    const merchantReplyAfter = [];
    const merchantReplyBefore = [];
    let mainEvaluation = {};

    let visitReview = false;
    let evaluationCreatedTime = 0;

    item.forEach(evaluationModel => {
      const {
        evaluation,
        evaluationAt,
        pictures,
        evaluationType,
      } = evaluationModel;
      switch (evaluationType) {
        case 1: // 商品评价
        // base
          mainEvaluation = evaluationModel;
          evaluationCreatedTime = evaluationAt;
          break;
        case 2: // 追评
        // buyerReview
          visitReview = true;
          buyerReview = {};
          buyerReview.evaluation = evaluation;
          buyerReview.pictures = pictures;
          buyerReview.days = _getDifferTime(evaluationAt, evaluationCreatedTime, 'days');
          break;
        case 3: // 商家回复
        // merchantReply
          const reply = {};
          reply.evaluation = evaluation;
          if (!visitReview) {
            merchantReplyBefore.push(reply);
          } else {
            merchantReplyAfter.push(reply);
          }
          break;
        default:
          break;
      }
    });

    return {
      mainEvaluation,
      buyerReview,
      merchantReplyAfter,
      merchantReplyBefore,
      evaluationAlias,
    };
  }
}

/**
 * 返回两个时间戳相差的天数
 *
 * @param {number} stamp1 时间戳 1
 * @param {number} stamp2 时间戳 2
 */
function _getDifferTime(stamp1, stamp2, option = 'days') {
  let differ = stamp1 - stamp2;
  differ = differ < 0 ? -differ : differ;
  switch (option) {
    case 'mins':
      return Math.floor(differ / 1000 / 60);
    case 'hours':
      return Math.floor(differ / 1000 / 60 / 60);
    case 'days':
      return Math.floor(differ / 1000 / 60 / 60 / 24);
  }
}

export { formatEvaluationData };
