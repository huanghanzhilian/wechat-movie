'use strict'



var Index = require('../app/controllers/index');
/*var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');*/

/*var multiparty = require('connect-multiparty')
var multipartMiddleware = multiparty();

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })*/


var game=require('../app/controllers/game');
var wechat = require('../app/controllers/wechat');

module.exports = function(router) {
    // Index
    router.get('/', Index.index)


    //weixin
    router.get('/movie',game.movie);
    router.get('/wx',wechat.hear);
    router.post('/wx',wechat.hear);

    /*//User
    router.post('/user/signup', User.signup);
    router.post('/user/signin', User.signin)
    router.get('/logout', User.logout)
    router.get('/signin', User.showSignin)
    router.get('/signup',User.showSignup)
    router.get('/admin/user/list',User.signinRequired, User.adminRequired, User.list);

    // Movie
    router.get('/movie/:id', Movie.detail);//查看视频页
    router.get('/admin/movie/new',User.signinRequired, User.adminRequired, Movie.new);//后台录入页
    router.get('/admin/movie/update/:id',User.signinRequired, User.adminRequired, Movie.update);//修改视频信息页
    router.post('/admin/movie',User.signinRequired, User.adminRequired,multipartMiddleware, Movie.savePoster,Movie.save);//后台录入页提交
    router.get('/admin/movie/list',User.signinRequired, User.adminRequired, Movie.list);//管理视频列表页
    router.delete('/admin/movie/list',User.signinRequired, User.adminRequired, Movie.del);//删除视频列表页


    // Comment
    router.post('/user/comment', User.signinRequired, Comment.save)

    // Category
    router.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new)
    router.post('/admin/category', User.signinRequired, User.adminRequired, Category.save)
    router.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list)


    // results
    router.get('/results', Index.search)*/
}