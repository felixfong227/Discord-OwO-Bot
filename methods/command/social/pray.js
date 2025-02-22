/*
 * OwO Bot for Discord
 * Copyright (C) 2019 Christopher Thai
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
  */

const CommandInterface = require('../../commandinterface.js');

const prayLines = ["May luck be in your favor.","You feel lucky!","You feel very lucky!","You can feel the luck within you!","Fortune favors you!","Luck is on your side!"];
const curseLines = ["You feel unlucky...","You feel very unlucky.","Oh no.","You should be careful...","I've got a bad feeling about this...","oh boy.","rip"];

module.exports = new CommandInterface({

	alias:["pray","curse"],

	args:"{@user}",

	desc:"Pray or curse yourself or other users!!",

	example:["owo pray","owo pray @scuttler"],

	related:[],

	permissions:["SEND_MESSAGES"],

	cooldown:300000,
	half:100,
	six:500,
	bot:true,

	execute: async function(p){
		let user = undefined;
		if(p.args.length>0){
			user = await p.global.getUser(p.args[0]);
			if(user){
				user = await p.global.getMember(p.msg.guild,user);
				if(!user){
					p.errorMsg(", That user is not in this guild!",3000);
					p.setCooldown(5);
					return;
				}
			}
		}
		if(user&&user.id == p.msg.author.id)
			user = undefined;
		let quest;

		let text = "";
		let authorPoints = 0, opponentPoints = 0;
		if(p.command=="pray"){
			let prayLine = prayLines[Math.floor(Math.random()*prayLines.length)];
			if(user){
				text = "**🙏 | "+p.msg.author.username+"** prays for **"+user.user.username+"**! "+prayLine;
				authorPoints = -1;
				opponentPoints = 1;
				quest = "prayBy";
			}else{
				text = "**🙏 | "+p.msg.author.username+"** prays... "+prayLine;
				authorPoints = 1;
			}
		}else{
			let curseLine = curseLines[Math.floor(Math.random()*curseLines.length)];
			if(user){
				text = "**👻 | "+p.msg.author.username+"** puts a curse on **"+user.user.username+"**! "+curseLine;
				authorPoints = 1;
				opponentPoints = -1;
				quest = "curseBy";
			}else{
				text = "**👻 | "+p.msg.author.username+"** is now cursed. "+curseLine;
				authorPoints = -1;
			}
		}

		// Check if id exists first
		let sql = "SELECT id FROM user WHERE id in ("+p.msg.author.id;
		let len = 1;
		if(opponentPoints&&user){
			sql += ","+user.id;
			len++;
		}
		sql += ");";
		let result = await p.query(sql);
		if(result.length<len){
			sql = "INSERT IGNORE INTO user (id,count) VALUES ("+p.msg.author.id+",0)";
			if(opponentPoints&&user)
				sql += ",("+(user.id)+",0);";
		}

		sql = "INSERT INTO luck (id,lcount) VALUES ("+p.msg.author.id+","+authorPoints+") ON DUPLICATE KEY UPDATE lcount = lcount "+((authorPoints>0)?"+"+authorPoints:authorPoints)+";";
		sql += "SELECT lcount FROM luck WHERE id = "+p.msg.author.id+";";
		if(opponentPoints&&user){
			sql += "INSERT INTO luck (id,lcount) VALUES ("+user.id+","+opponentPoints+") ON DUPLICATE KEY UPDATE lcount = lcount "+((opponentPoints>0)?"+"+opponentPoints:opponentPoints)+";";
			sql += "INSERT IGNORE INTO user_pray (sender,receiver,count,latest) VALUES ("+p.msg.author.id+","+user.id+",1,NOW()) ON DUPLICATE KEY UPDATE count = count + 1, latest = NOW();";
		}
		p.con.query(sql,function(err,result){
			if(err) {console.error(err);return;}
			text += "\n**<:blank:427371936482328596> |** You have **"+(result[1][0].lcount)+"** luck point(s)!";
			p.send(text);
			if(user&&quest) p.quest(quest,1,user.user);
			if(opponentPoints&&user)
				p.logger.value(p.command,1,['guild:'+p.msg.guild.id,'channel:'+p.msg.channel.id,'to:'+user.id,'from:'+p.msg.author.id]);
			else
				p.logger.value(p.command,1,['guild:'+p.msg.guild.id,'channel:'+p.msg.channel.id,'to:'+p.msg.author.id,'from:'+p.msg.author.id]);
		});
	}

})
