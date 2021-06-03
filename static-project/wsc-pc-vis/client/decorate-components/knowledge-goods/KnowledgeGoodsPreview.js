/* eslint-disable */
import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';
import { KnowledgeGoods } from '@youzan/vis-ui';
import unify from '../common/vue-preview/unify';
import VuePreview from '../common/vue-preview';

import * as Types from './types.js';
import * as Enums from './enums.js';

const vueComponent = unify(KnowledgeGoods);

const mockGoodMap = {
  course: {
    alias: "default",
    courseType: 0,
    createdAt: "2018-12-12 16:19:53",
    num: 0,
    pictureWrapDTO: {
      url: 'https://img.yzcdn.cn/public_files/2018/01/30/585dae8447d80013ef9344adc973c6ee.png?imageView2/2/w/730/h/0/q/75/format/png',
    },
    sellPoint: '此处显示课程描述',
    tagList: [
      {
        tag: "标签"
      }
    ],
    price: 9999,
    sellStatus: 0,
    shortenUrl: "",
    title: "此处显示课程标题",
    totalSoldNum: 9999,
    totalStock: 100,
    courseStartAt: '2018/11/20',
    courseEndAt: '2018/11/21',
  },
  column: {
    "alias":"1y5f8l1lcyyly",
    "author":"",
    "buyStatus":{
        "groupOnNum":0,
        "isBought":0,
        "isFree":0,
        "isFreeForVip":0,
        "isGroupOn":0,
        "isVipDiscount":0,
        "price":9999
    },
    "contentsCount":0,
    "createdAt":1545896129000,
    "goodsId":363591857,
    "id":363587879,
    "isUpdate":1,
    "kdtId":51055158,
    "picture":{
        "cover":"https://img.yzcdn.cn/public_files/2018/01/30/585dae8447d80013ef9344adc973c6ee.png?imageView2/2/w/730/h/0/q/75/format/png",
        "picHeight":0,
        "picId":0,
        "picWidth":0
    },
    "price":9999,
    "publishAt":1545896129000,
    "status":1,
    "subscriptionsCount":9999,
    "summary":"此处显示专栏简介",
    "title":"此处显示专栏标题",
    "updatedAt":1545896129000,
    "url":"https://h5.youzan.com/v2/ump/paidcontent/index?page=columnshow&kdt_id=51055158&spm=#/columnshow?alias=1y5f8l1lcyyly"
  },
  content: {
    "id":21875,
    "goods_id":363591848,
    "alias":"3neb9ih7o4qmu",
    "title":"此处显示内容标题",
    "kdt_id":51055158,
    "column_id":0,
    "column_title":"此处显示所属专栏",
    "column_alias":"",
    "column_is_update":null,
    "summary":"此处显示内容简介",
    "author":"尚古",
    "cover":"https://img.yzcdn.cn/public_files/2018/01/30/585dae8447d80013ef9344adc973c6ee.png?imageView2/2/w/730/h/0/q/75/format/png",
    "is_free":0,
    "seller_type":1,
    "media_type":3,
    "video_duration":10,
    "preview":"",
    "content":"3191201",
    "price":9999,
    "status":1,
    "serial_no":0,
    "audio_whole_size":null,
    "audio_whole_name":null,
    "audio_preview_size":null,
    "audio_preview_name":null,
    "pic_id":0,
    "pic_width":0,
    "pic_height":0,
    "publish_at":"2018-12-27 15:31:20",
    "created_at":"2018-12-27T15:31:20Z",
    "updated_at":"2018-12-27T15:31:20Z",
    "sub_create_time":null,
    "audio_summary":null,
    "video_id":3191201,
    "video_text":null,
    "video_preview_id":null,
    "video_preview_text":null,
    "audio_text":null,
    "audio_preview_text":null,
    "video_whole_name":null,
    "video_url":null,
    "video_status":4,
    "video_status_desc":"审核通过",
    "video_category_id":null,
    "video_preview_category_id":null,
    "video_whole_size":"1",
    "video_cover":null,
    "video_cover_width":null,
    "video_cover_height":null,
    "video_count_played_url":null,
    "video_play_count":null,
    "video_preview_name":null,
    "video_preview_size":null,
    "video_preview_url":null,
    "video_preview_status":null,
    "video_preview_status_desc":null,
    "video_preview_cover":null,
    "video_preview_count_played_url":null,
    "video_preview_cover_width":null,
    "video_preview_cover_height":null,
    "video_preview_play_count":null,
    "has_full_content":null,
    "operator":null,
    "live_status":null,
    "live_start_at":null,
    "show_in_store":1,
    "live_detail_url":null,
    "popularize_code":null,
    "join_level_discount":null,
    "benefit_pkg_ids":null,
    "benefit_pkgs":null,
    "channel_type":null,
    "from_user_name":null,
    "column_serial_no":0,
    "assist_txt_type":0,
    "buy_status":{
        "isFree":0,
        "isBought":0,
        "isFreeForVip":0,
        "isGroupOn":0,
        "groupOnNum":0,
        "isVipDiscount":0,
        "price":9999,
        "cardId":null
    },
    "biz_type":null,
    "hide_comment":null,
    "next_owl_info":null,
    "join_group_setting":null,
    "collect_info_setting":null,
    "distributor_pics":null,
    "sold_out":9999,
    "url":"https://h5.youzan.com/v2/ump/paidcontent/index?kdt_id=51055158&page=contentshow&alias=3neb9ih7o4qmu&qr=paidcontent_3neb9ih7o4qmu",
    "qrcode":"https://b.yzcdn.cn/fix-base64/bd2169b4ef224c3bf88342caeb48e8e9eca19596b56c9787949dc0331e96fdda.png"
  },
  live: {
    "alias":"1y938dewtknwm",
    "id":363368989,
    "goods_id":363593483,
    "title":"此处显示直播标题",
    "cover":"https://img.yzcdn.cn/public_files/2018/01/30/585dae8447d80013ef9344adc973c6ee.png?imageView2/2/w/730/h/0/q/75/format/png",
    "summary":"此处显示直播简介",
    "price":9999,
    "lecturer":"ctting",
    "sell_status":1,
    "show_in_store":1,
    "seller_type":3,
    "live_status":1,
    "live_start_at":"2018-12-28 15:20:32",
    "live_start_time":"2018-12-28 15:20:32",
    "sales":9999,
    "is_free":0,
    "publish_at":"2018-12-27 15:20:37",
    "column_title":null,
    "live_detail_url":"http://h5.youzan.com/v2/ump/paidcontent?kdt_id=51055158&sg=live&page=livedetail&alias=1y938dewtknwm",
    "popularize_code":"https://b.yzcdn.cn/fix-base64/50b4263b8e330fb2013d7b3d2288261769965d0d3badcaa931e3ed68bd4ffda7.png",
    "created_at":"2018-12-27 15:20:37",
    "buy_status":null,
    "serial_no":0
  }
};

/**
 * 根据列表样式返回不同个数的mock数据
 * @param {Number} listMode 
 */
function mockGoodsByListMode(listMode, goodsFrom) {
  const mockGoodItem = mockGoodMap[goodsFrom];
  let mockGoodList;
  switch (listMode) {
    // 大图模式
    case 0:
      mockGoodList = new Array(3).fill(mockGoodItem);
      break;
    // 一行两个
    case 1:
      mockGoodList = new Array(4).fill(mockGoodItem);
      break;
    // 一行三个
    case 2:
      mockGoodList = new Array(6).fill(mockGoodItem);
      break;
    // 详细列表
    case 3:
      mockGoodList = new Array(3).fill(mockGoodItem);
      break;
    // 一大两小
    case 4:
      mockGoodList = new Array(3).fill(mockGoodItem);
      break;
    // 横向滚动
    case 5:
      mockGoodList = new Array(6).fill(mockGoodItem);
      break;
  }

  return mockGoodList;
}

/**
 * @name pc端知识商品组件预览
 * @author 蒙多<yanglifeng>
 */
export default class KnowledgeGoodsPreview extends (PureComponent || Component) {
  static propTypes = {
    value: PropTypes.object,
    design: PropTypes.object
  };

  render() {
    const { knowledgeGoodsData } = this.props.value;
    const { goodList, listMode, goodsFrom } = knowledgeGoodsData;

    return (
      <VuePreview
        vueComponent={vueComponent}
        value={{
          props: {
            ...knowledgeGoodsData,
            goodList: goodList.length < 1
              ? mockGoodsByListMode(listMode, goodsFrom)
              : goodList
          }
        }}
        className={`rc-design-component-${Types.key}-preview`} />
    );
  }
}
