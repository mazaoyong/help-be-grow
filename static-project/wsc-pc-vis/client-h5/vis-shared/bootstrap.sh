#!/bin/sh
#vant版本除1.4.10、1.5.10以及>=1.6.8都有sku留言时间选择在ios选不了的问题，谨慎升级!!

echo 'bootstrap shared'

yarn='yarn --prod=false --registry=http://registry.npm.qima-inc.com --disturl=http://npm.taobao.org/mirrors/node'

# $yarn add \
#   lodash@4.17.11 \
#   vant@1.6.6 \
#   @youzan/client-log-sdk@0.7.0 \
#   @youzan/utils@2.3.6 \
#   @youzan/vis-ui@0.1.34
