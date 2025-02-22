const mysqlHandler = require('../handler/mysqlHandler.js');
const mysql = new mysqlHandler();
const imagegenAuth = require('../../tokens/imagegen.json');
const request = require('request');
const levels = require('./levels.js');
const global = require('./global.js');
const levelupEmoji = '🎉';
const infoEmoji = 'ℹ';

exports.distributeRewards = async function(msg){
	// If bot does not have permission to send a message, ignore.
	let perms = msg.channel.permissionsFor(msg.guild.me);
	if(!perms.has('SEND_MESSAGES')||!perms.has('ATTACH_FILES')) return;

	let level = (await levels.getUserLevel(msg.author.id)).level;
	let sql = `SELECT user.uid,user_level_rewards.rewardLvl FROM user LEFT JOIN user_level_rewards ON user.uid = user_level_rewards.uid WHERE id = ${msg.author.id};`;
	sql += `SELECT levelup FROM guild_setting WHERE id = ${msg.guild.id};`;
	let result = await mysql.query(sql);
	let uid,plevel = 0;

	// level up is disabled in the guild
	if(result[1][0]&&result[1][0].levelup==1) return;

	// No uid
	if(!result[0][0]||!result[0][0].uid){
		sql = `INSERT IGNORE INTO user (id,count) VALUES (${msg.author.id},0);`;
		let result2 = await mysql.query(sql);
		uid = result2.insertId;
	}else{
		uid = result[0][0].uid;
	}
	
	if(result[0][0]&&result[0][0].rewardLvl)
		plevel = result[0][0].rewardLvl;

	// If user already got the reward, ignore.
	if(plevel >= level) return;

	// Get reward
	let cowoncy = 0;
	let lootbox = 0;
	let weaponcrate = 0;
	for(let i = plevel+1;i<=level;i++){
		let reward = getReward(i);
		cowoncy += reward.cowoncy;
		lootbox += reward.lootbox;
		weaponcrate += reward.weaponcrate;
	}

	// Grab Image
	let uuid;
	try{
		uuid = await generateImage(msg,{level,cowoncy,lootbox,weaponcrate});
		if(!uuid||uuid=="") throw "No uuid";
	}catch(e){
		return;
	}

	// Update database reward level
	if(plevel){
		sql = `UPDATE user_level_rewards SET rewardLvl = ${level} WHERE uid = ${uid} AND rewardLvl = ${plevel};`;
		result = await mysql.query(sql);
		if(!result.changedRows) return;
	}else{
		sql = `INSERT IGNORE INTO user_level_rewards (uid,rewardLvl) VALUES (${uid},${level});`;
		result = await mysql.query(sql);
		if(!result.affectedRows) return;
	}

	// Distribute rewards sql
	sql = `INSERT INTO cowoncy (id,money) VALUES (${msg.author.id},${cowoncy}) ON DUPLICATE KEY UPDATE money = money + ${cowoncy};
			INSERT INTO crate (uid,boxcount) VALUES (${uid},${weaponcrate}) ON DUPLICATE KEY UPDATE boxcount = boxcount + ${weaponcrate};
			INSERT INTO lootbox(id,boxcount) VALUES (${msg.author.id},${lootbox}) ON DUPLICATE KEY UPDATE boxcount = boxcount + ${lootbox};`;
	
	// Set up reply text
	let url = imagegenAuth.imageGenUrl+'/levelup/'+uuid+'.png';
	let text = levelupEmoji+" **| "+msg.author.username+"** leveled up!";
	if(level-plevel>1) text += "\n<:blank:427371936482328596> **|** Extra rewards were added for missing levels";
	if(!plevel) text += "\n"+infoEmoji+" **|** Level up messages can be disabled for the guild with `owo level disabletext`";

	// distribute and send
	await mysql.query(sql);
	await msg.channel.send(text,{files:[url]});
}

function getReward(lvl){
	let cowoncy = lvl * 5000;
	let lootbox = lvl;
	let weaponcrate = lvl;
	return { cowoncy, lootbox, weaponcrate };
}

async function generateImage(msg,reward){
	let background = await getBackground(msg.author);

	let avatarURL = msg.author.avatarURL()
	if(!avatarURL) avatarURL= msg.author.defaultAvatarURL;
	avatarURL = avatarURL.replace('.gif','.png').replace(/\?[a-zA-Z0-9=?&]+/gi,'');

	let info = {
		theme:{
			background:background.id,
			name_color:background.color,
		},
		user:{
			avatarURL,
			name:msg.author.username,
		},
		level:reward.level,
		rewards:[
			{img:'cowoncy.png',text:'+'+global.toFancyNum(reward.cowoncy)},
			{img:'lootbox.png',text:'+'+global.toFancyNum(reward.lootbox)},
			{img:'crate.png',text:'+'+global.toFancyNum(reward.weaponcrate)},
		]
	};
	info.password = imagegenAuth.password;
	try{
		return new Promise( (resolve, reject) => {
			let req = request({
				method:'POST',
				uri:imagegenAuth.levelupImageUri,
				json:true,
				body: info,
			},(error,res,body)=>{
				if(error){
					resolve("");
					return;
				}
				if(res.statusCode==200)
					resolve(body);
				else
					resolve("");
			});
		});
	}catch (err){
		console.err(err);
		return "";
	}
}

async function getBackground(user){
	let sql = `SELECT b.name_color,b.bid FROM user u INNER JOIN user_profile up ON u.uid = up.uid INNER JOIN backgrounds b ON up.bid = b.bid WHERE id = ${user.id};`
	let result = await mysql.query(sql);
	if(!result[0])
		return {id:1};
	return {id:result[0].bid,color:result[0].name_color};
}
