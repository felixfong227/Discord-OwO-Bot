/*
 * OwO Bot for Discord
 * Copyright (C) 2019 Christopher Thai
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
  */

const CommandInterface = require('../../commandinterface.js');

const dateUtil = require('../../../util/dateUtil.js');

module.exports = new CommandInterface({

	alias:["cookie","rep"],

	args:"{@user}",

	desc:"Give a user a cookie!",

	example:["owo cookie @user","owo cookie"],

	related:[],

	permissions:["SEND_MESSAGES"],

	cooldown:5000,
	half:100,
	six:500,
	bot:true,

	execute: function(p){
		if(p.args.length==0)
			display(p);
		else
			give(p,p.con,p.msg,p.args,p.global,p.send);

	}

})

async function give(p,con,msg,args,global,send){
	var id = "";
	if(args.length==1&&global.isUser(args[0]))
		id = args[0].match(/[0-9]+/)[0];
	else{
		send("**🚫 |** Wrong arguments! >:c",3000);
		return;
	}

	var user = await global.getUser(id);
	if(user==undefined){
		send("**🚫 |** Could not find that user!",3000);
		return;
	}else if(msg.author.id==user.id){
		send("**🚫 |** You can't give yourself a cookie, silly!",3000);
		return;
	}else{
		user = await p.global.getMember(p.msg.guild,user);
		if(!user){
			p.errorMsg(", That user is not in this guild!",3000);
			return;
		}
	}

	let sql = "SELECT user.uid,cookieTime FROM user LEFT JOIN timers ON user.uid = timers.uid WHERE id = "+p.msg.author.id+";";
	let result = await p.query(sql);

	let afterMid = dateUtil.afterMidnight(result[0]?result[0].cookieTime:undefined);

	if(afterMid&&!afterMid.after){
		p.errorMsg(", Nu! You need to wait **"+afterMid.hours+"H "+afterMid.minutes+"M "+afterMid.seconds+"S**",3000);
		return;
	}

	sql = "INSERT INTO rep (id,count) VALUES ("+user.id+",1) ON DUPLICATE KEY UPDATE count = count + 1;";
	if(!result[0]) sql += "INSERT IGNORE INTO user (id,count) VALUES ("+p.msg.author.id+",0);";
	sql += "INSERT INTO timers (uid,cookieTime) VALUES ((SELECT uid FROM user WHERE id = "+p.msg.author.id+"),"+afterMid.sql+") ON DUPLICATE KEY UPDATE cookieTime = "+afterMid.sql+";";

	result = await p.query(sql);
	send("**<a:cookieeat:423020737364885525> | "+user.user.username+"**! You got a cookie from **"+msg.author.username+"**! *nom nom nom c:<*");
	p.quest("cookieBy",1,user.user);

}

async function display(p){
	let sql = "SELECT cookieTime,rep.count FROM user LEFT JOIN timers ON user.uid = timers.uid JOIN rep ON user.id = rep.id WHERE user.id = "+p.msg.author.id+";";
	let result = await p.query(sql);
	let afterMid = dateUtil.afterMidnight(result[0]?result[0].cookieTime:undefined);

	let count = 0;
	if(result[0]&&result[0].count) count = result[0].count;
	var again = "You have one cookie to send!";

	if(afterMid&&!afterMid.after){
		again = "You can send a cookie in **"+afterMid.hours+"H "+afterMid.minutes+"M "+afterMid.seconds+"S**! ";
	}
	p.send("**<a:cookieeat:423020737364885525> | "+p.msg.author.username+"**! You currently have **"+count+"** cookies! Yummy! c:<\n**<:blank:427371936482328596> |** "+again);
}
