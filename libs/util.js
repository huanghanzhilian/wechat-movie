'use strict'

var fs = require('fs');
var Promise = require('bluebird');

//读取
exports.readFileAsync = function(fpath, encoding) {

    return new Promise(function(resolve, reject) {
        fs.readFile(fpath, encoding, function(err, content) {
            if (err) reject(err)
            else { resolve(content) }
        });
    })
}

//写
exports.writeFileAsync = function(fpath, content) {

    return new Promise(function(resolve, reject) {
        fs.writeFile(fpath, content, function(err) {

            if (err) reject(err)
            else { resolve() }
        });
    })
}

//js sdk
var crypto=require('crypto');//sha1排序算法

//生产随机字符串
var createNonce=function(){
    return Math.random().toString(36).substr(2,15);
}
//生成时间戳
var createTimestamp=function(){
    return parseInt(new Date().getTime()/1000,10)+'';
}
var _sign=function(noncestr,ticket,timesstr,url){
    var params=[
        'noncestr='+noncestr,
        'jsapi_ticket='+ticket,
        'timestamp='+timesstr,
        'url='+url
    ]
    var str=params.sort().join('&');
    var shasum=crypto.createHash('sha1');
    shasum.update(str);
    return shasum.digest('hex');
}
//生产签名  暴露出去
exports.sign=function(ticket,url){
    var noncestr=createNonce();
    var timesstr=createTimestamp();
    var signature=_sign(noncestr,ticket,timesstr,url);
    return {
        noncestr:noncestr,
        timesstr:timesstr,
        signature:signature
    }
}