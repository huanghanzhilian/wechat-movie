'use strict'

var wechat = require('../../wechat/g')
var reply = require('../../wx/reply')
var wx = require('../../wx/index')

exports.hear = function*(next) {
  console.log(this.method)
  this.middle = wechat(wx.wechatOptions, reply.reply)
  yield* this.middle(next)
}