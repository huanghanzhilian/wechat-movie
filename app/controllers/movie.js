var Movie = require('../models/movie.js'); // 载入mongoose编译后的模型movie
var _underscore = require('underscore'); // _.extend用新对象里的字段替换老的字段
var Comment = require('../models/comment'); // 载入mongoose编译后的模型comment
var Category = require('../models/category');



var fs = require('fs')
var path = require('path')


// admin poster
exports.savePoster = function(req, res, next) {
    var posterData = req.files.uploadPoster
    var filePath = posterData.path
    var originalFilename = posterData.originalFilename

    if (originalFilename) {
        fs.readFile(filePath, function(err, data) {
            var timestamp = Date.now()
            var type = posterData.type.split('/')[1]
            var poster = timestamp + '.' + type
            var newPath = path.join(__dirname, '../../', '/public/upload/' + poster)

            fs.writeFile(newPath, data, function(err) {
                req.poster = poster
                next()
            })
        })
    } else {
        next()
    }
}

// detail page 详情页
exports.detail = function(req, res) {
    var id = req.params.id;
    //每次访问更新pv
    Movie.update({_id: id}, {$inc: {pv: 1}}, function(err) {
        if (err) {
            console.log(err)
        }
    })


    Movie.findById(id, function(err, movie) {
        Comment
        .find({movie: id})
        .populate('from', 'name')
        .populate('reply.to reply.from', 'name')
        .exec(function(err, comments) {
            console.log(comments)
            res.render('detail', {
                title: 'i_movie' + movie.title,
                movie: movie,
                comments: comments
            });
        })
    });
};

// admin new page 后台录入页
exports.new = function(req, res) {
    Category.find({}, function(err, categories) {
        res.render('admin', {
            title: '后台录入页',
            categories: categories,
            movie: {}
        })
    })
};



// admin update movie 后台更新页
exports.update = function(req, res) {
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function(err, movie) {
            Category.find({}, function(err, categories) {
                res.render('admin', {
                    title: '后台更新页',
                    movie: movie,
                    categories:categories
                });
            })
        });
    }
};



// admin post movie 后台录入提交  电影的保存
exports.save = function(req, res) {
    var id = req.body.movie._id || "";
    var movieObj = req.body.movie || "";
    var _movie = null;

    if (req.poster) {
        movieObj.poster = req.poster
    }

    if (id) { // 已经存在的电影数据
        Movie.findById(id, function(err, movie) {
            if (err) {
                console.log(err);
            }
            _movie = _underscore.extend(movie, movieObj); // 用新对象里的字段替换老的字段
            _movie.save(function(err, movie) {
                if (err) {
                    console.log(err);
                }
                /*Category.findById(movieObj.category, function(err, category) {
                    console.log(category)
                    category.movies.push(movie.id);
                    category.save(function(err, category) {
                        res.redirect('/movie/' + movie._id);
                    })
                })*/
                res.redirect('/movie/' + movie._id);
            });
        });
    } else { // 新加的电影
        _movie = new Movie(movieObj);
        var categoryId=movieObj.category;
        var categoryName=movieObj.categoryName;
        _movie.save(function(err, movie) {
            if (err) {
                console.log(err);
            }
            if(categoryId){
                Category.findById(categoryId, function(err, category) {
                    category.movies.push(movie._id);
                    category.save(function(err, category) {
                        res.redirect('/movie/' + movie._id);
                    })
                })
            }else if(categoryName){
                //新增视频标签
                var category=new Category({
                    name:categoryName,
                    movies:[movie._id]
                });
                category.save(function(err, category) {
                    movie.category = category._id
                    movie.save(function(err, movie) {
                        res.redirect('/movie/' + movie._id)
                    })
                })
            }
        });
    }
};


// list page 列表页
exports.list = function(req, res) {
    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: '列表页',
            movies: movies
        });
    });
};


// list delete movie data 列表页删除电影
exports.del = function(req, res) {
    var id = req.query.id;
    if (id) {
        Movie.remove({
            _id: id
        }, function(err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.json({
                    success: 1
                });
            }
        });
    }
};