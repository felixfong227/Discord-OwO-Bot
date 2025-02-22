/*
 * OwO Bot for Discord
 * Copyright (C) 2019 Christopher Thai
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
  */

const CommandInterface = require('../../commandinterface.js');

const global = require('../../../util/global.js');
const animals = require('../../../../tokens/owo-animals.json');
const animalUtil = require('../battle/util/animalUtil.js');
const animalUtil2 = require('../zoo/animalUtil.js');
const levels = require('../../../util/levels.js');

module.exports = new CommandInterface({

	alias:["top","rank","ranking"],

	args:"points|guild|zoo|money|cookie|pet|huntbot|luck|curse|battle|daily|level [global] {count}",

	desc:"Displays the top ranking of each category!",

	example:["owo top zoo","owo top cowoncy global","owo top p g"],

	related:["owo my"],

	permissions:["SEND_MESSAGES"],

	cooldown:5000,
	half:100,
	six:500,

	execute: async function(p){
		await display(p,p.con,p.msg,p.args);
	}

})

/**
 * Check for valid arguments to display leaderboards
 * @param {mysql.Connection}	con 	- Mysql.createConnection()
 * @param {discord.Message}	msg 	- Discord's message
 * @param {string[]}		args 	- Command arguments
 */
async function display(p,con, msg, args){
	var channel = msg.channel;
	//check for args
	var globala = false;

	var points = false;
	var guild = false;
	var money = false;
	var zoo = false;
	var rep = false;
	var pet = false;
	var huntbot,luck,curse,daily,battle,level;

	var invalid = false;
	var count = 5;

	for(var i=0;i<args.length;i++){
		if(!points&&!guild&&!money&&!zoo&&!rep&&!pet&&!huntbot&&!luck&&!curse&&!daily&&!battle&&!level){
			if(args[i]=== "points"||args[i]==="point"||args[i]==="p") points = true;
			else if(args[i]==="guild"||args[i]==="server"||args[i]==="s"||args[i]==="g") guild = true;
			else if(args[i]=== "zoo"||args[i]==="z") zoo = true;
			else if(args[i]=== "cowoncy"||args[i]==="money"||args[i]==="m"||args[i]==="c") money = true;
			else if(args[i]==="cookies"||args[i]==="cookie"||args[i]==="rep"||args[i]==="r") rep = true;
			else if(args[i]==="pets"||args[i]==="pet") pet = true;
			else if(args[i]==="huntbot"||args[i]==="hb") huntbot = true;
			else if(args[i]==="luck") luck = true;
			else if(args[i]==="curse") curse = true;
			else if(args[i]==="battle"||args[i]==="streak") battle = true;
			else if(args[i]==="daily") daily = true;
			else if(args[i]==="level"||args[i]==="lvl"||args[i]==="xp") level= true;
			else if(args[i]==="global"||args[i]==="g") globala = true;
			else if(global.isInt(args[i])) count = parseInt(args[i]);
			else invalid = true;
		}else if(args[i]==="global"||args[i]==="g") globala = true;
		else if(global.isInt(args[i])) count = parseInt(args[i]);
		else invalid = true;
	}
	if (count>25) count = 25;
	else if (count<1) count = 5;

	if(invalid){
		msg.channel.send("**🚫 |** Invalid ranking type!")
			.catch(err => console.error(err));
	}else{
		if(points) getRanking(globala,con,msg,count);
		else if(guild) getGuildRanking(con,msg,count);
		else if(zoo) getZooRanking(globala,con,msg,count);
		else if(money) getMoneyRanking(globala,con,msg,count);
		else if(rep) getRepRanking(globala,con,msg,count);
		else if(pet) getPetRanking(globala,con,msg,count);
		else if(huntbot) getHuntbotRanking(globala,con,msg,count);
		else if(luck) getLuckRanking(globala,con,msg,count);
		else if(curse) getCurseRanking(globala,con,msg,count);
		else if(battle) getBattleRanking(globala,con,msg,count);
		else if(daily) getDailyRanking(globala,con,msg,count);
		else if(level) await getLevelRanking(globala,p,count);
		else getRanking(globala,con,msg,count);
	}
}

function displayRanking(con,msg,count,globalRank,sql,title,subText){
	con.query(sql,async function(err,rows,fields){
		if(err) {console.error(err); return;}
		var rank = 1;
		var ranking = [];
		var embed = "```md\n< "+title+" >\n";
		if(rows[1][0]!==undefined&&rows[1][0]!==null){
			embed += "> Your Rank: "+rows[1][0].rank+"\n";
			embed += subText(rows[1][0],0);
		}
		for(let ele of rows[0]){
			var id = String(ele.id);

			if(!globalRank){
				var user = msg.guild.members.get(id);
				var name = "";
				if(user&&user.nickname)
					name = user.nickname+" ("+user.user.username+")";
				else if(user&&user.user.username)
					name = ""+user.user.username;
				else
					name = "User not found";
			}else{
				var user = await global.getUser(id);
				var name = "";
				if(user === undefined || user.username === undefined)
					name = "User Left Bot";
				else
					name = ""+user.username;
			}

			name = name.replace("discord.gg","discord,gg").replace(/(```)/g, "`\u200b``");
			embed += "#"+rank+"\t"+name+subText(ele,rank);
			rank++;
		};
		var date = new Date();
		embed += (date.toLocaleString("en-US", {month: '2-digit', day: '2-digit', year:'numeric', hour12:false, hour: '2-digit', minute:'2-digit'})+"```");
		msg.channel.send(embed,{split:{prepend:'```md\n',append:'```'}})
			.catch(err => console.error(err));

	});
}

/**
 * Top OwO Rankings
 * @param {boolean}		globalRank	- Global rankings
 * @param {mysql.Connection}	con 	- Mysql.createConnection()
 * @param {discord.Message}	msg	- User's message
 * @param {int} 		count 	- number of ranks to display
 */
function getRanking(globalRank, con, msg, count){
	var sql;
	if(globalRank){
		sql = "SELECT * FROM user ORDER BY count DESC LIMIT "+count+";";
		sql += "SELECT id,count,(SELECT COUNT(*)+1 FROM user WHERE count > u.count) AS rank FROM user u WHERE u.id = "+msg.author.id+";";
	}else{
		var userids = global.getids(msg.guild.members);
		sql = "SELECT * FROM user WHERE id IN ( "+userids+ " ) ORDER BY count DESC LIMIT "+count+";";
		sql += "SELECT id,count,(SELECT COUNT(*)+1 FROM user WHERE id IN ("+userids+") AND count > u.count) AS rank FROM user u WHERE u.id = "+msg.author.id+";";
	}

	displayRanking(con,msg,count,globalRank,sql,
		"Top "+count+" "+((globalRank)?"Global OwO Rankings":"OwO Rankings for "+msg.guild.name),
		function(query,rank){
			if(rank==0) return ">\t\tyou said owo "+global.toFancyNum(query.count)+" times!\n\n";
			else return "\n\t\tsaid owo "+global.toFancyNum(query.count)+" times!\n"
		}
	);
}

/**
 * displays zoo ranking
 */
function getZooRanking(globalRank, con, msg, count){
	var sql;
	if(globalRank){
		sql = "SELECT *,"+points+" AS points FROM animal_count ORDER BY points DESC LIMIT "+count+";";
		sql   +=  "SELECT *,"+points+" AS points,(SELECT COUNT(*)+1 FROM animal_count WHERE "+points+" > "+apoints+" ) AS rank FROM animal_count a WHERE a.id = "+msg.author.id+";";
	}else{
		var users = global.getids(msg.guild.members);
		sql = "SELECT *,"+points+" AS points FROM animal_count WHERE id IN ("+users+") ORDER BY points DESC LIMIT "+count+";";
		sql   +=  "SELECT *,"+points+" AS points,(SELECT COUNT(*)+1 FROM animal_count WHERE "+points+" > "+apoints+" AND id IN ("+users+")) AS rank FROM animal_count a WHERE a.id = "+msg.author.id+";";
	}

	displayRanking(con,msg,count,globalRank,sql,
		"Top "+count+" "+((globalRank)?"Global Zoo Rankings":"Zoo Rankings for "+msg.guild.name),
		function(query,rank){
			if(rank==0) return ">\t\t"+global.toFancyNum(query.points)+" zoo points: "+animalUtil2.zooScore(query)+"\n\n";
			else return "\n\t\t"+global.toFancyNum(query.points)+" zoo points: "+animalUtil2.zooScore(query)+"\n";
		}
	);
}

/**
 * displays cowoncy ranking
 */
function getMoneyRanking(globalRank, con, msg, count){
	var sql;
	if(globalRank){
		sql = "SELECT * FROM cowoncy ORDER BY money DESC LIMIT "+count+";";
		sql +=  "SELECT id,money,(SELECT COUNT(*)+1 FROM cowoncy WHERE money > c.money) AS rank FROM cowoncy c WHERE c.id = "+msg.author.id+";";
	}else{
		var users = global.getids(msg.guild.members);
		sql = "SELECT * FROM cowoncy WHERE id IN ("+users+") ORDER BY money DESC LIMIT "+count+";";
		sql +=  "SELECT id,money,(SELECT COUNT(*)+1 FROM cowoncy WHERE id IN ("+users+") AND money > c.money) AS rank FROM cowoncy c WHERE c.id = "+msg.author.id+";";
	}

	displayRanking(con,msg,count,globalRank,sql,
		"Top "+count+" "+((globalRank)?"Global Cowoncy Rankings":"Cowoncy Rankings for "+msg.guild.name),
		function(query,rank){
			if(rank==0) return ">\t\tCowoncy: "+global.toFancyNum(query.money)+"\n\n";
			else return "\n\t\tCowoncy: "+global.toFancyNum(query.money)+"\n";
		}
	);
}

/**
 * displays rep ranking
 */
function getRepRanking(globalRank, con, msg, count){
	var sql;
	if(globalRank){
		sql = "SELECT * FROM rep ORDER BY count DESC LIMIT "+count+";";
		sql +=  "SELECT id,count,(SELECT COUNT(*)+1 FROM rep WHERE count > c.count) AS rank FROM rep c WHERE c.id = "+msg.author.id+";";
	}else{
		var users = global.getids(msg.guild.members);
		sql = "SELECT * FROM rep WHERE id IN ("+users+") ORDER BY count DESC LIMIT "+count+";";
		sql +=  "SELECT id,count,(SELECT COUNT(*)+1 FROM rep WHERE id IN ("+users+") AND count > c.count) AS rank FROM rep c WHERE c.id = "+msg.author.id+";";
	}

	displayRanking(con,msg,count,globalRank,sql,
		"Top "+count+" "+((globalRank)?"Global Cookie Rankings":"Cookie Rankings for "+msg.guild.name),
		function(query,rank){
			if(rank==0) return ">\t\tCookies: "+global.toFancyNum(query.count)+"\n\n";
			else return "\n\t\tCookies: "+global.toFancyNum(query.count)+"\n";
		}
	);
}

/**
 * displays pet ranking
 */
function getPetRanking(globalRank, con, msg, count){
	var sql;
	if(globalRank){
		sql = "SELECT * FROM animal ORDER BY xp DESC LIMIT "+count+";";
		sql +=  "SELECT *,(SELECT COUNT(*)+1 FROM animal WHERE xp > c.xp) AS rank FROM animal c WHERE c.id = "+msg.author.id+" ORDER BY xp DESC LIMIT 1;";
	}else{
		var users = global.getids(msg.guild.members);
		sql = "SELECT * FROM animal WHERE id IN ("+users+") ORDER BY xp DESC LIMIT "+count+";";
		sql +=  "SELECT *,(SELECT COUNT(*)+1 FROM animal WHERE id IN ("+users+") AND xp > c.xp) AS rank FROM animal c WHERE c.id = "+msg.author.id+" ORDER BY xp DESC LIMIT 1;";
	}

	displayRanking(con,msg,count,globalRank,sql,
		"Top "+count+" "+((globalRank)?"Global Pet Rankings":"Pet Rankings for "+msg.guild.name),
		function(query,rank){
			let result = "\t\t ";
			if(query.nickname!=null)
				result += query.nickname+" ";
			let lvl = animalUtil.toLvl(query.xp);
			result += `Lvl. ${lvl.lvl} ${lvl.currentXp}xp\n`;
			if(rank==0) return ">"+result+"\n";
			else return "\n"+result;
		}
	);
}

/**
 * Top HuntBot Rankings
 */
function getHuntbotRanking(globalRank, con, msg, count){
	var sql;
	if(globalRank){
		sql = "SELECT id,(essence+efficiency+duration+cost+gain+exp) as total FROM autohunt ORDER BY total DESC LIMIT "+count+";";
		sql +=  "SELECT id,(essence+efficiency+duration+cost+gain+exp) as total, (SELECT COUNT(*)+1 FROM autohunt WHERE (essence+efficiency+duration+cost+gain+exp) > total) AS rank FROM autohunt c WHERE c.id = "+msg.author.id+" ORDER BY total DESC LIMIT 1;";
	}else{
		var users = global.getids(msg.guild.members);
		sql = "SELECT id,(essence+efficiency+duration+cost+gain+exp) as total FROM autohunt WHERE id IN ("+users+") ORDER BY total DESC LIMIT "+count+";";
		sql +=  "SELECT id,(essence+efficiency+duration+cost+gain+exp) as total, (SELECT COUNT(*)+1 FROM autohunt WHERE id IN ("+users+") AND (essence+efficiency+duration+cost+gain+exp) > total) AS rank FROM autohunt c WHERE c.id = "+msg.author.id+" ORDER BY total DESC LIMIT 1;";
	}

	displayRanking(con,msg,count,globalRank,sql,
		"Top "+count+" "+((globalRank)?"Global HuntBot Rankings":"HuntBot Rankings for "+msg.guild.name),
		function(query,rank){
			if(rank==0) return ">\t\tEssence: "+global.toFancyNum(query.total)+"\n\n";
			else return "\n\t\tEssence: "+global.toFancyNum(query.total)+"\n";
		}
	);
}

/**
 * Top HuntBot Rankings
 */
function getLuckRanking(globalRank, con, msg, count){
	var sql;
	if(globalRank){
		sql = "SELECT * FROM luck ORDER BY lcount DESC LIMIT "+count+";";
		sql +=  "SELECT *, (SELECT COUNT(*)+1 FROM luck WHERE lcount > c.lcount) AS rank FROM luck c WHERE c.id = "+msg.author.id+" ORDER BY lcount DESC LIMIT 1;";
	}else{
		var users = global.getids(msg.guild.members);
		sql = "SELECT * FROM luck WHERE id IN ("+users+") ORDER BY lcount DESC LIMIT "+count+";";
		sql +=  "SELECT *, (SELECT COUNT(*)+1 FROM luck WHERE id IN ("+users+") AND lcount > c.lcount) AS rank FROM luck c WHERE c.id = "+msg.author.id+" ORDER BY lcount DESC LIMIT 1;";
	}

	displayRanking(con,msg,count,globalRank,sql,
		"Top "+count+" "+((globalRank)?"Global Luck Rankings":"Luck Rankings for "+msg.guild.name),
		function(query,rank){
			if(rank==0) return ">\t\tLuck: "+global.toFancyNum(query.lcount)+"\n\n";
			else return "\n\t\tLuck: "+global.toFancyNum(query.lcount)+"\n";
		}
	);
}

/**
 * Top HuntBot Rankings
 */
function getCurseRanking(globalRank, con, msg, count){
	var sql;
	if(globalRank){
		sql = "SELECT * FROM luck ORDER BY lcount ASC LIMIT "+count+";";
		sql +=  "SELECT *, (SELECT COUNT(*)+1 FROM luck WHERE lcount < c.lcount) AS rank FROM luck c WHERE c.id = "+msg.author.id+" ORDER BY lcount DESC LIMIT 1;";
	}else{
		var users = global.getids(msg.guild.members);
		sql = "SELECT * FROM luck WHERE id IN ("+users+") ORDER BY lcount ASC LIMIT "+count+";";
		sql +=  "SELECT *, (SELECT COUNT(*)+1 FROM luck WHERE id IN ("+users+") AND lcount < c.lcount) AS rank FROM luck c WHERE c.id = "+msg.author.id+" ORDER BY lcount DESC LIMIT 1;";
	}

	displayRanking(con,msg,count,globalRank,sql,
		"Top "+count+" "+((globalRank)?"Global Curse Rankings":"Curse Rankings for "+msg.guild.name),
		function(query,rank){
			if(rank==0) return ">\t\tLuck: "+global.toFancyNum(query.lcount)+"\n\n";
			else return "\n\t\tLuck: "+global.toFancyNum(query.lcount)+"\n";
		}
	);
}

/**
 * displays guild ranking
 * @param {mysql.Connection}	con 	- Mysql.createConnection()
 * @param {discord.Message}	msg	- User's message
 * @param {int} 		count 	- number of ranks to display
 */
function getGuildRanking(con, msg, count){
	var channel = msg.channel;
	//Grabs top 5
	var sql = "SELECT * FROM guild ORDER BY count DESC LIMIT "+count+";";
	sql   +=  "SELECT id,count,(SELECT COUNT(*)+1 FROM guild WHERE count > g.count) AS rank FROM guild g WHERE g.id = "+msg.guild.id+";";

	//Create an embeded message
	con.query(sql,async function(err,rows,fields){
		if(err) {console.error(err); return;}
		var rank = 1;
		var ranking = [];
		var embed = "```md\n< Top "+count+" Guild OwO Rankings >\n";
		if(rows[1][0]!==undefined&&rows[1][0]!==null){
			embed += "> Your Guild Rank: "+rows[1][0].rank+"\n";
			embed += ">\t\tcollectively said owo "+global.toFancyNum(rows[1][0].count)+" times!\n\n";
		}
		for(let ele of rows[0]){
			var id = String(ele.id);
			var name = await global.getGuildName(id);
			if(name == null|| name == "")
				name = "Guild Left Bot";
			name = name.replace("discord.gg","discord,gg");
			embed += "#"+rank+"\t"+name+"\n\t\tcollectively said owo "+global.toFancyNum(ele.count)+" times!\n";
			rank++;
		}
		var date = new Date();
		embed += ("\n*Spamming owo will not count!!!* | "+date.toLocaleString("en-US", {month: '2-digit', day: '2-digit', year:'numeric', hour12:false, hour: '2-digit', minute:'2-digit'})+"```");
		channel.send(embed)
			.catch(err => console.error(err));
	});
}

/**
 * Top Battle Rankings
 */
function getBattleRanking(globalRank, con, msg, count){
	var sql;
	if(globalRank){
		sql = "SELECT * FROM pet_team INNER JOIN user ON user.uid = pet_team.uid ORDER BY streak DESC LIMIT "+count+";";
		sql +=  "SELECT *, (SELECT COUNT(*)+1 FROM pet_team WHERE streak > c.streak) AS rank FROM pet_team c INNER JOIN user ON c.uid = user.uid WHERE user.id = "+msg.author.id+";";
	}else{
		var users = global.getids(msg.guild.members);
		sql = "SELECT * FROM pet_team INNER JOIN user ON pet_team.uid = user.uid WHERE id IN ("+users+") ORDER BY streak DESC LIMIT "+count+";";
		sql +=  "SELECT *, (SELECT COUNT(*)+1 FROM pet_team LEFT JOIN user ON pet_team.uid = user.uid WHERE id IN ("+users+") AND streak > c.streak) AS rank FROM pet_team c INNER JOIN user ON c.uid = user.uid WHERE user.id = "+msg.author.id+";";
	}

	displayRanking(con,msg,count,globalRank,sql,
		"Top "+count+" "+((globalRank)?"Global Battle Streak Rankings":"Battle Streak Rankings for "+msg.guild.name),
		function(query,rank){
			if(rank==0) return ">\t\t"+(query.tname?query.tname+" - ":"")+"Streak: "+global.toFancyNum(query.streak)+"\n\n";
			else return "\n\t\t"+(query.tname?query.tname+" - ":"")+"Streak: "+global.toFancyNum(query.streak)+"\n";
		}
	);
}

/**
 * Top daily rankings
 */
function getDailyRanking(globalRank, con, msg, count){
	var sql;
	if(globalRank){
		sql = "SELECT * FROM cowoncy ORDER BY daily_streak DESC LIMIT "+count+";";
		sql +=  "SELECT *, (SELECT COUNT(*)+1 FROM cowoncy WHERE daily_streak > c.daily_streak) AS rank FROM cowoncy c WHERE c.id = "+msg.author.id+";";
	}else{
		var users = global.getids(msg.guild.members);
		sql = "SELECT * FROM cowoncy WHERE id IN ("+users+") ORDER BY daily_streak DESC LIMIT "+count+";";
		sql +=  "SELECT *, (SELECT COUNT(*)+1 FROM cowoncy WHERE id IN ("+users+") AND daily_streak > c.daily_streak) AS rank FROM cowoncy c WHERE c.id = "+msg.author.id+";";
	}

	displayRanking(con,msg,count,globalRank,sql,
		"Top "+count+" "+((globalRank)?"Global Daily Streak Rankings":"Daily Streak Rankings for "+msg.guild.name),
		function(query,rank){
			if(rank==0) return ">\t\tStreak: "+global.toFancyNum(query.daily_streak)+"\n\n";
			else return "\n\t\tStreak: "+global.toFancyNum(query.daily_streak)+"\n";
		}
	);
}

async function getLevelRanking(global, p, count){
	let ranking,userRank,userLevel,text;
	if(global){
		ranking = await levels.getGlobalRanking(count);
		userRank = await levels.getUserRank(p.msg.author.id);
		userLevel = await levels.getUserLevel(p.msg.author.id);
		text = "```md\n< Top "+count+" Global Level Rankings >\n> Your Rank: "+p.global.toFancyNum(userRank)+"\n>\t\tLvl "+userLevel.level+" "+userLevel.currentxp+"xp\n\n";
	}else{
		ranking = await levels.getServerRanking(p.msg.guild.id,count);
		userRank = await levels.getUserServerRank(p.msg.author.id,p.msg.guild.id);
		userLevel = await levels.getUserServerLevel(p.msg.author.id,p.msg.guild.id);
		text = "```md\n< Top "+count+" Level Rankings for "+p.msg.guild.name+" >\n> Your Rank: "+p.global.toFancyNum(userRank)+"\n>\t\tLvl "+userLevel.level+" "+userLevel.currentxp+"xp\n\n";
	}
	let counter = 0;

	for(let i in ranking){
		if(i%2){
			let tempLevel = await levels.getLevel(ranking[i]);
			text += "\t\tLvl "+tempLevel.level+" "+tempLevel.currentxp+"xp\n";
		}else{
			counter++;
			let user = await p.global.getUser(ranking[i]);
			if(!user) user = "User Left Discord";
			else user = user.username;
			text += "#"+counter+"\t"+user+"\n";
		}
	}

	let date = new Date();
	text+= "\n"+date.toLocaleString("en-US", {month: '2-digit', day: '2-digit', year:'numeric', hour12:false, hour: '2-digit', minute:'2-digit'})+"```";

	await p.send(text,null,{split:{prepend:'```md\n',append:'```'}});
}

const points = "(common*"+animals.points.common+"+"+
		"uncommon*"+animals.points.uncommon+"+"+
		"rare*"+animals.points.rare+"+"+
		"epic*"+animals.points.epic+"+"+
		"mythical*"+animals.points.mythical+"+"+
		"special*"+animals.points.special+"+"+
		"patreon*"+animals.points.patreon+"+"+
		"cpatreon*"+animals.points.cpatreon+"+"+
		"hidden*"+animals.points.hidden+"+"+
		"gem*"+animals.points.gem+"+"+
		"legendary*"+animals.points.legendary+"+"+
		"fabled*"+animals.points.fabled+")";
const apoints = "(a.common*"+animals.points.common+"+"+
		"a.uncommon*"+animals.points.uncommon+"+"+
		"a.rare*"+animals.points.rare+"+"+
		"a.epic*"+animals.points.epic+"+"+
		"a.mythical*"+animals.points.mythical+"+"+
		"a.special*"+animals.points.special+"+"+
		"a.patreon*"+animals.points.patreon+"+"+
		"a.cpatreon*"+animals.points.cpatreon+"+"+
		"a.hidden*"+animals.points.hidden+"+"+
		"a.gem*"+animals.points.gem+"+"+
		"a.legendary*"+animals.points.legendary+"+"+
		"a.fabled*"+animals.points.fabled+")";
