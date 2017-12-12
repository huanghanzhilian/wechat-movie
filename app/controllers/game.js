'use strict'



var wx = require('../../wx/index')
var util = require('../../libs/util')
var Movie = require('../api/movie')



//对外暴露一个方法，提供后面中间件的处理
exports.guess=function *(next){
    var wechatApi = wx.getWechat()
    var data=yield wechatApi.fetchAccessToken();
    var access_token=data.access_token;
    var ticketData=yield wechatApi.fetchTicket(access_token);
    var ticket=ticketData.ticket;
    var url=this.href;
    var params=util.sign(ticket,url)
    yield this.body = this.render('wechat/game1',params);
}


exports.find=function *(next){
    var id = this.params.id
    var wechatApi = wx.getWechat()
    var data=yield wechatApi.fetchAccessToken();
    var access_token=data.access_token;
    var ticketData=yield wechatApi.fetchTicket(access_token);
    var ticket=ticketData.ticket;
    var url=this.href;
    var params=util.sign(ticket,url)

    var movie = yield Movie.searchById(id)
    params.movie = movie
    console.log(params)
    yield this.body = this.render('wechat/movie',params);
}
