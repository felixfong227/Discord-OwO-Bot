const redis = require('redis');
const client = redis.createClient();

exports.incr = function(key,value=1){
	return new Promise(function(res,rej){
		client.incrby(key,value,function(err,reply){
			if(err)
				rej(err);
			else
				res(reply);
		});
	});
}

exports.hgetall = function(key){
	return new Promise(function(res,rej){
		client.hgetall(key,function(err,val){
			if(err) rej(err);
			else res(val);
		});
	});
}

exports.hmset = function(key,val){
	return new Promise(function(res,rej){
		client.hmset(key,val,function(err,val){
			if(err) rej(err);
			else res(val);
		});
	});
}

exports.incr = function(table,key,val=1){
	return new Promise(function(res,rej){
		client.zincrby(table,val,key,function(err,reply){
			if(err)
				rej(err);
			else
				res(reply);
		});
	});
}

exports.getTop = function(table,count = 5){
	return new Promise(function(res,rej){
		client.zrevrange(table,0,count-1,'WITHSCORES',function(err,reply){
			if(err)
				rej(err);
			else
				res(reply);
		});
	});
}

exports.getRange = function(table,min,max){
	return new Promise(function(res,rej){
		client.zrevrange(table,min,max,'WITHSCORES',function(err,reply){
			if(err)
				rej(err);
			else
				res(reply);
		});
	});
}

exports.getXP = function(table,id){
	return new Promise(function(res,rej){
		client.zscore(table,id,function(err,reply){
			if(err)
				rej(err);
			else
				res(reply);
		});
	});
}

exports.getRank = function(table,id){
	return new Promise(function(res,rej){
		client.zrevrank(table,id,function(err,reply){
			if(err)
				rej(err);
			else
				res(reply);
		});
	});
}

exports.sadd = function(table,value){
	return new Promise(function(res,rej){
		client.sadd(table,value,function(err,reply){
			if(err)
				rej(err);
			else
				res(reply);
		});
	});
}

exports.del = function(table){
	return new Promise(function(res,rej){
		client.del(table,function(err,reply){
			if(err)
				rej(err);
			else
				res(reply);
		});
	});
}

client.on('connect',function(){
	//console.log('Redis connected');
});

client.on('error',function(err){
	console.error("Redis error on "+(new Date()).toLocaleString());
	console.error(err);
});
