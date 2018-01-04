'use strict'

var Koa = require('koa');
var path = require('path');
var fs = require('fs');
var Wechat = require('./wechat/wechat');//微信方法

var mongoose = require('mongoose'); // 加载mongoose模块
var dbUrl = 'mongodb://localhost:27017/imovie';
mongoose.connect(dbUrl); // 连接mongodb本地数据库imovie
console.log('MongoDB connection success!');

var game=require('./app/controllers/game');
var wechat = require('./app/controllers/wechat');

var menu=require('./wx/menu');
var wx=require('./wx/index');
var wechatApi = wx.getWechat();
//删除菜单
wechatApi.deleteMenu().then(function(){
    wechatApi.createMenu(menu)
    console.log('删除成功')
})



var app = new Koa(); //实例化koa web服务器
var Router = require('koa-router')
var router = new Router()
var views = require('koa-views')


app.use(views(__dirname + '/app/views', {
  extension: 'jade'
}))





router.get('/movie',game.guess);
router.get('/movie/:id',game.find);
router.get('/wx',wechat.hear);
router.post('/wx',wechat.hear);


//require('./config/routes')(router)


app
  .use(router.routes())
  .use(router.allowedMethods());



app.listen(1234)
console.log('Listening: 1234')

