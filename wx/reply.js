'use strict'

var path=require('path');
var config = require('../config');
var Wechat = require('../wechat/wechat');
var Movie=require('../app/api/movie');

// var help = '亲爱的，欢迎关注科幻电影世界\n' +
//    '回复 1 ~ 3，测试文字回复\n' +
//    '回复 4，测试图文回复\n' +
//    '回复 首页，进入电影首页\n' +
//    '回复 电影名字，查询电影信息\n' +
//    '某些功能订阅号无权限，如网页授权\n' +
//    '回复 语音，查询电影信息\n' +
//    '也可以点击 <a href="' + options.baseUrl + '/wechat/movie">语音查电影</a>'

exports.reply = function*(next) {
    var message = this.weixin;
    console.log(message)
    //关于事件类型
    if (message.MsgType === 'event') {
        //关注
        if (message.Event === 'subscribe') {
            var data = yield wechatApi.getUserInfo(message.FromUserName);
            this.body = data;
        }
        //取消关注
        else if (message.Event === 'unsubscribe') {
            console.log('无情取关')
            this.body = ''
        }
        //地理位置
        else if (message.Event === 'LOCATION') {
            this.body = '您上报的位置是:' + message.Latitude + '/' + message.Longitude + '-' + message.Precision
        }
        //点击了菜单
        else if (message.Event === 'CLICK') {
            this.body = '您点击了菜单:' + message.EventKey
        }
        //扫描
        else if (message.Event === 'SCAN') {
            console.log('关注后二维码' + message.EventKey + ' ' + message.Ticket)
            this.body = '看到你扫了一下哦';
        }
        //点击菜单中的链接
        else if (message.Event === 'VIEW') {
            this.body = '您点击了菜单中的链接' + message.EventKey;
        }
    }
    else if (message.MsgType === 'voice') {
        var voiceText = message.Recognition
        console.log(voiceText)
        /*var movies=yield Movie.searchByName(content);
        
        if (!movies || movies.length === 0) {
            movies = yield Movie.searchByDouban(content)
        }
        if (movies && movies.length > 0) {

            reply = []

            movies = movies.slice(0, 6)

            movies.forEach(function(movie) {
                console.log(movie.images.large)
                reply.push({
                    title: movie.title,
                    description: movie.title,
                    picUrl: movie.poster||movie.images.large,
                    url: 'http://node-wechat.tunnel.qydev.com/movie/'+movie._id
                })
            })
        }
        else {
            reply = '没有查询到与 ' + content + ' 匹配的电影，要不要换一个名字试试'
        }
*/
        var reply = '没有查询到与 ' + voiceText + ' 匹配的电影，要不要换一个名字试试'
        this.body = reply
    }
     else if (message.MsgType === 'text') {
        var content = message.Content;
        var reply = '额,您说的' + content + ' 太复杂了'
        if (content == '1') {
            reply = '天下第一吃大米111';
        } else if (content == '2') {
            reply = '天下第二吃豆腐';
        } else if (content == '3') {
            reply = '天下第三吃仙丹';
        }
        //回复图文
        else if (content == '4') {
            reply = [{
                title: '技术改变世界',
                description: '只是个描述而已',
                picUrl: 'http://static.samured.com/assets/images/video/cover/iQVBBrK_gEM.jpg',
                url: 'http://www.huanghanlian.com/'
            }, {
                title: '游戏',
                description: '好玩',
                picUrl: 'http://static.samured.com/assets/images/video/cover/Dnnq9FDEubI.jpg',
                url: 'https://github.com/huanghanzhilian'
            }];
        }else{
            var movies=yield Movie.searchByName(content);
            
            if (!movies || movies.length === 0) {
                movies = yield Movie.searchByDouban(content)
            }
            
            if (movies && movies.length > 0) {

                reply = []

                movies = movies.slice(0, 6)

                movies.forEach(function(movie) {
                    reply.push({
                        title: movie.title,
                        description: movie.title,
                        picUrl: movie.poster||movie.images.large,
                        url: 'http://node-wechat.tunnel.qydev.com/movie/'+movie._id
                    })
                })
            }
            else {
                reply = '没有查询到与 ' + content + ' 匹配的电影，要不要换一个名字试试'
            }
        }
        this.body = reply;
    }


    yield next
};