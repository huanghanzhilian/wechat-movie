//引入mongoose建模工具模块
var mongoose=require('mongoose');
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

//声明一个MovieSchema调用mongoose的Schema方法传入对象
var MovieSchema=new mongoose.Schema({
	//定义字段类型
	director:String,//导演 字符串类型
	title:String,
	doubanId:String,
	language:String,//语言
	country:String,//国家
	summary:String,//简介
	flash:String,//地址
	poster:String,//海报地址
	genres: [String],
	year:Number,//年份
	pv: {
		type: Number,
		default:0//默认值创建的时间
	},
	category: {
		type: ObjectId,
		ref: 'category'
	},
	meta:{//录入数据或更新时，时间记录
		createAt:{//创建时间
			type:Date,//日期类型
			default:Date.now()//默认值创建的时间
		},
		updataAt:{//更新时间
			type:Date,//日期类型
			default:Date.now()//默认值创建的时间
		}
	}
});


//为模式添加一个方法
//每次添加数据之前都会来调用这个方法
MovieSchema.pre('save',function(next){
	//判断数据是否是新加的
	if(this.isNew){
		this.meta.createAt=this.meta.updataAt=Date.now();
	}else{
		this.meta.updataAt=Date.now();
	}
	next();
});


// movieSchema 模式的静态方法
MovieSchema.statics={
	fetch:function(cb){
		return this
		.find({})
		.sort('meta.updataAt')
		.exec(cb)
	},
	findByid:function(id,cb){
		return this
		.findOne({_id:id})
		.exec(cb)
	}
}



// 导出movieSchema模式
module.exports=MovieSchema;