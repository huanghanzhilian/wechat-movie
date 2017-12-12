var Movie = require('../models/movie'); // 载入mongoose编译后的模型movie
var Category = require('../models/category');
// var koa_request=require('koa-request');
var Promise = require('bluebird')
var request = Promise.promisify(require('request'))
var _ = require('lodash');//对象合并

// 查询所有的电影分类 以及分类下的电影
exports.findAll = function *() {
	var categories=yield Category
	.find({})
	.populate({
		path: 'movies',
		select: 'title poster',
		options: { limit: 6 }
	})
	.exec()
	return categories;
}


// 根据电影分类
exports.searchByCategory = function *(catId) {
	var categories=yield Category
	.find({_id:catId})
	.populate({
		path: 'movies',
		select: 'title poster',
		options: { limit: 6 }
	})
	.exec()
	return categories;
}


// 根据电影名字
exports.searchByName = function *(q) {
	var movies=yield Movie
	.find({
		title: new RegExp(q + '.*', 'i')
	})
	.exec()
	return movies;
}

exports.searchById = function *(id){
	var movie=yield Movie
    .findOne({_id: id})
    .exec()
    return movie;
}

//不是批量查询，而是一个个查询
const updateMovies = function *(movie) {
  var options = {
	url: 'https://api.douban.com/v2/movie/subject/' + movie.doubanId,
	json: true
  }
  var response = yield request(options);
  var data = JSON.parse(response.body) 
  _.extend(movie, {
    country: data.countries[0],
    language: data.language,
    summary: data.summary
  })

  /*request(options).then(function(response){
	var data=response[1];

	_.extend(movie, {
		country: data.countries[0],
		language: data.language,
		summary: data.summary
	  })
  })*/


  console.log(data)

  //拿到电影的种类
  var genres = movie.genres
  //如果不是一个空数组
  if (genres && genres.length > 0) {
	var cateArray = []
	//遍历种类
	genres.forEach(function(genre) {
	  cateArray.push(function *(){
		var cat = yield Category.findOne({name: genre}).exec();

		if (cat) {
		  cat.movies.push(movie._id)
		  yield cat.save()
		}
		else {
		  cat = new Category({
			name: genre,
			movies: [movie._id]
		  })

		  cat = yield cat.save();
		  movie.category = cat._id
		  yield movie.save()
		}
	  })
	})

	//Promise.all(cateArray)
  }
  else {
	movie.save()
  }
}


exports.searchByDouban = function *(q){
	var options = {
		url: 'https://api.douban.com/v2/movie/search?q='
	}

	options.url += encodeURIComponent(q);

	var response = yield request(options);
	var data = JSON.parse(response.body) 
	var subjects = [];
	var movies = [];

	if (data && data.subjects) {
		subjects = data.subjects
	}

	if (subjects.length > 0) {
		var queryArray = [];

		subjects.forEach(function(item){
			queryArray.push(function *(){
				//查看在数据库是否存过
				var movie = yield Movie.findOne({
					doubanId: item.id
				})
				//如果存在
				if (movie) {
					movies.push(movie)
				}
				//如果没有存储过
				else {
					var directors = item.directors || []
					var director = directors[0] || {}

					movie = new Movie({
						director: director.name || '',
						title: item.title,
						doubanId: item.id,
						poster: item.images.large,
						year: item.year,
						genres: item.genres || []
					})

					movie = yield movie.save() 
					movies.push(movie)
				}
			})
		})

		yield queryArray

		//异步任务上传搜索视频
		movies.forEach(function(movie){
			updateMovies(movie)
		})
	}

	return movies
}

//director