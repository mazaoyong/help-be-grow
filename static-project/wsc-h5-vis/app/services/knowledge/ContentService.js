const mapKeysToSnakeCase = require('zan-utils/string/mapKeysToSnakeCase');
const _ = require('lodash');
const { formatOwlDateTimeStr } = require('../../utils');
const KnowledgeBaseService = require('./KnowledgeBaseService');
const VipBenefitService = require('./blocks/VipBenefitService');
const ColumnService = require('../owl/client/onlinecourse/ClientColumnFacade');
const { sellType } = require('../../constants/knowledge');

class ContentService extends KnowledgeBaseService {
  /**
   * 查询内容列表
   */
  async getContentList(kdtId, page, columnAlias, size, url = '') {
    const data = {
      page,
      size,
      status: 1,
    };
    if (columnAlias) {
      Object.assign(data, {
        columnAlias,
        sortBy: 'serialNo',
        sortType: 'desc',
      });
    }
    let ret = await this.owlApiCall({
      url: url || `/${kdtId}/contents/`,
      data,
    });
    ret = {
      list: await this.formatContentList(kdtId, ret.items),
      page_no: ret.paginator.page,
      total: ret.paginator.totalCount,
    };
    return ret;
  }

  /**
   * 查询内容列表（包含直播）
   */
  async getContentAndLiveList(kdtId, page, columnAlias, size) {
    return this.getContentList(kdtId, page, columnAlias, size,
      `/${kdtId}/contentsAndLives/`);
  }

  /**
   * 内容详情
   */
  async getContent(kdtId, buyerId, alias) {
    // 完全克隆过来的，里面有一些诡异的逻辑看不太懂，没敢改
    let isSubscriptions = false;
    let content = await this.getContentPreview(kdtId, alias);
    // eslint-disable-next-line eqeqeq
    if (content.mediaType == 2) {
      content.audioSummary = null;
      content.audioText = null;
    }
    // eslint-disable-next-line eqeqeq
    if (content.mediaType == 3) {
      content.videoText = null;
    }

    let vipInfo = {};
    if (buyerId) {
      isSubscriptions = await this.getSubscriptions(kdtId, buyerId, alias, 2);
      if (content.bizType !== 1) {
        vipInfo = await new VipBenefitService(this.ctx).getVipCardInfo(kdtId, buyerId, alias, 'content');
      }
    }

    // 订阅或者内容免费试读或者0元购,都可以看到完整信息
    if (isSubscriptions ||
        content.isFree ||
        vipInfo.is_vip_free ||
        // eslint-disable-next-line eqeqeq
        (content.price == 0 && [sellType.SINGLE_SELL, sellType.ALL_SELL].includes(content.sellerType))
    ) {
      content = await this.getContentDetail(kdtId, alias);
    }

    content.vipInfo = vipInfo;

    content = mapKeysToSnakeCase(content);

    content.is_paid = +isSubscriptions;
    // 音频类型特殊处理
    // eslint-disable-next-line eqeqeq
    content.media_type == 2 ? content.media_url = '' : content.media_url = content.content;

    // 归属column 数据拼接
    content.column_detail = {};
    if (content.column_alias) {
      const column = await new ColumnService(this.ctx).getColumnDetail(kdtId, content.column_alias);
      const columnDetail = column.columnDetail || {};
      Object.assign(content.column_detail, {
        alias: content.column_alias,
        title: columnDetail.title,
        contentsCount: columnDetail.contents_count,
        cover: columnDetail.cover,
        price: columnDetail.price,
      });
    }
    // 日期处理
    content.publish_at = formatOwlDateTimeStr(content.publish_at);
    return content;
  }

  /**
   * 已订购的内容列表
   */
  async getSubscriptionsContentList(kdtId, buyerId, page, size) {
    let ret = await this.owlApiCall({
      url: `/${buyerId}/subscriptions/${kdtId}/contentsAndLives`,
      data: {
        page,
        size,
      },
    });
    ret.items = ret.items.map(item => {
      item = mapKeysToSnakeCase(item);
      item.created_at = formatOwlDateTimeStr(item.created_at);
      item.updated_at = formatOwlDateTimeStr(item.created_at);
      item.sub_create_time = formatOwlDateTimeStr(item.sub_create_time);
      return item;
    });
    return {
      list: await this.formatContentList(kdtId, ret.items),
      page_no: ret.paginator.page,
      total: ret.paginator.totalCount,
    };
  }

  // ====

  /**
   * 获取content preview
   */
  async getContentPreview(kdtId, alias) {
    return this.owlApiCall({
      url: `/${kdtId}/contents/${alias}/preview`,
    });
  }

  /**
   * 获取content detail
   */
  async getContentDetail(kdtId, alias) {
    return this.owlApiCall({
      url: `/${kdtId}/contents/${alias}/detail`,
    });
  }

  /**
   * 内容列表补充整理数据
   */
  async formatContentList(kdtId, contentList) {
    contentList = mapKeysToSnakeCase(contentList);
    const columnAliasList = [];
    for (let item of contentList) {
      item.column_alias && (columnAliasList.push(item.column_alias));
      if (item.publish_at) {
        item.publish_at = formatOwlDateTimeStr(item.publish_at, 'MM-DD');
      }
    }
    const columnsInfoMap = await this.getColumnsInfo(kdtId, columnAliasList);
    for (let item of contentList) {
      item.column_title = columnsInfoMap[item.column_alias] && columnsInfoMap[item.column_alias].title;
    }
    return contentList;
  }

  /**
   * 根据column alias列表，获取column信息
   */
  async getColumnsInfo(kdtId, columnAliasList) {
    let columnsInfo = {};
    if (!columnAliasList || !columnAliasList.length) return columnsInfo;
    const columnAliasChunkList = _.chunk(columnAliasList, 10);
    /* eslint-disable */
    for (let aliasChunk of columnAliasChunkList) {
      let tempColumnsInfo = await this.owlApiCall({
        url: `/${kdtId}/columns/batch`,
        data: { aliases: aliasChunk.join(',') }
      });
      tempColumnsInfo.forEach(item => {
        columnsInfo[item.alias] = item
      });
    }
    /* eslint-enable */
    return columnsInfo;
  }
}

module.exports = ContentService;
