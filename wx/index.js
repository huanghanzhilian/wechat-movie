'use strict'

var path = require('path')
var util = require('../libs/util')
var Wechat = require('../wechat/wechat')
var wechat_file = path.join(__dirname, '../config/wechat.txt')
var wechat_ticket_file = path.join(__dirname, '../config/wechat_ticket.txt')

var config = {
  wechat: {
        appID: 'wx1a2b42155c618d7a',
        appSecret: 'e20ea29de64febee0fbf4c1caf835279',
        token: 'weixin',
        getAccessToken: function() {
            return util.readFileAsync(wechat_file);
        },
        saveAccessToken: function(data) {
          data=JSON.stringify(data);
            return util.writeFileAsync(wechat_file,data);
        },
        getTicket: function() {
            return util.readFileAsync(wechat_ticket_file);
        },
        saveTicket: function(data) {
            data=JSON.stringify(data);
            return util.writeFileAsync(wechat_ticket_file,data);
        },
    }
}

exports.wechatOptions = config

exports.getWechat = function() {
  var wechatApi = new Wechat(config.wechat)

  return wechatApi
}