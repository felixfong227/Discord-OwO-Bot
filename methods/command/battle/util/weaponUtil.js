/*
 * OwO Bot for Discord
 * Copyright (C) 2019 Christopher Thai
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
  */

const requireDir = require('require-dir');
const WeaponInterface = require('../WeaponInterface.js');
const ReactionOverride = require('../../../../overrides/ReactionSocketOverride.js');

const prices = {"Common":100,"Uncommon":250,"Rare":400,"Epic":600,"Mythical":2000,"Legendary":5000,"Fabled":20000};
const ranks = [['cw','commonweapons','commonweapon'],['uw','uncommonweapons','uncommonweapon'],['rw','rareweapon','rareweapons'],
      ['ew','epicweapons','epicweapon'],['mw','mythicalweapons','mythicalweapon','mythicweapons','mythicweapon'],
      ['lw','legendaryweapons','legendaryweapon'],['fw','fabledweapons','fabledweapon','fableweapons','fableweapon']];

const weaponEmoji = "🗡";
const weaponPerPage = 10;
const nextPageEmoji = '➡';
const prevPageEmoji = '⬅';
const rewindEmoji = '⏪';
const fastForwardEmoji = '⏩';
const sortEmoji = '🔃';

/* Initialize all the weapons */
const weaponsDir = requireDir('../weapons');
var weapons = {};
var availableWeapons = {};
for(var key in weaponsDir){
	let weapon = weaponsDir[key];
	weapons[weapon.getID] = weapon;
	if(!weapon.disabled) availableWeapons[weapon.getID] = weapon;
}

exports.getRandomWeapon = function(id){
	/* Grab a random weapon */
	let keys = Object.keys(availableWeapons);
	let random = keys[Math.floor(Math.random()*keys.length)];

	let weapon = availableWeapons[random];

	/* Initialize random stats */
	weapon = new weapon();

	return weapon;
}

exports.getItems = async function(p){
	var sql = `SELECT wid,count(uwid) AS count FROM user_weapon WHERE uid = (SELECT uid FROM user WHERE id = ${p.msg.author.id}) GROUP BY wid`;
	var result = await p.query(sql);
	var items = {};
	for(var i = 0;i<result.length;i++){
		var key = result[i].wid;
		if(weapons[key])
			items[key] = {id:(key+100),count:result[i].count,emoji:weapons[key].getEmoji};
	}
	return items;
}

var parseWeapon = exports.parseWeapon = function(data){
	if(!data.parsed){
		/* Parse stats */
		data.stat = data.stat.split(",");
		if(data.stat[0]=='') data.stat = [];
		for(var i=0;i<data.stat.length;i++)
			data.stat[i] = parseInt(data.stat[i]);

		/* Grab all passives */
		for(var i=0;i<data.passives.length;i++){
			let stats = data.passives[i].stat.split(",");
			for(var j=0;j<stats.length;j++)
				stats[j] = parseInt(stats[j]);
			let passive = new (WeaponInterface.allPassives[data.passives[i].id])(stats);
			data.passives[i] = passive;
		}
		data.parsed = true;
	}

	/* Convert data to actual weapon data */
	if(!weapons[data.id]) return;
	let weapon = new (weapons[data.id])(data.passives,data.stat);
	weapon.uwid = data.uwid;
	weapon.ruwid = data.ruwid;
	weapon.pid = data.pid;
	weapon.animal = data.animal;

	return weapon;
}

var parseWeaponQuery = exports.parseWeaponQuery = function(query){
	/* Group weapons by uwid and add their respective passives */
	let weapons = {};
	for(var i=0;i<query.length;i++){
		if(query[i].uwid){
			var key = "_"+query[i].uwid;
			if(!(key in weapons)){
				weapons[key] = {
					uwid:shortenUWID(query[i].uwid),
					ruwid:query[i].uwid,
					pid:query[i].pid,
					id:query[i].wid,
					stat:query[i].stat,
					animal:{
						name:query[i].name,
						nickname:query[i].nickname
					},
					passives:[]
				};
			}
			if(query[i].wpid)
				weapons[key].passives.push({
					id:query[i].wpid,
					pcount:query[i].pcount,
					stat:query[i].pstat
				});
		}
	}
	return weapons;
}

/* Displays weapons with multiple pages */
var display = exports.display = async function(p,pageNum=0,sort=0,opt){
	if(!opt) opt = {};
	let {users,msg,user} = opt;
	if(!users) users = [];
	if(!user) user = p.msg.author;
	users.push(user.id);

	/* Construct initial page */
	let page = await getDisplayPage(p,user,pageNum,sort,opt);
	if(!page) return;

	/* Send msg and add reactions */
	if(!msg)
		msg = await p.msg.channel.send({embed:page.embed});
	else
		await msg.edit({embed:page.embed});

	msg = await msg.channel.messages.fetch(msg.id);

	if(page.maxPage>19) await msg.react(rewindEmoji);
	await msg.react(prevPageEmoji);
	await msg.react(nextPageEmoji);
	if(page.maxPage>19) await msg.react(fastForwardEmoji);
	await msg.react(sortEmoji);
	let filter = (reaction,user) => [sortEmoji,nextPageEmoji,prevPageEmoji,rewindEmoji,fastForwardEmoji].includes(reaction.emoji.name)&&users.includes(user.id);
	let collector = await msg.createReactionCollector(filter,{time:900000,idle:120000});
	ReactionOverride.addEmitter(collector,msg);

	let handler = async function(r){
		try{
			if(page){
			/* Save the animal's action */
			if(r.emoji.name===nextPageEmoji) {
				if(pageNum+1<page.maxPage) pageNum++;
				else pageNum = 0;
				page = await getDisplayPage(p,user,pageNum,sort,opt);
				if(page) await msg.edit({embed:page.embed});
			}else if(r.emoji.name===prevPageEmoji){
				if(pageNum>0) pageNum--;
				else pageNum = page.maxPage-1;
				page = await getDisplayPage(p,user,pageNum,sort,opt);
				if(page) await msg.edit({embed:page.embed});
			}else if(r.emoji.name===sortEmoji){
				sort = (sort+1)%4;
				page = await getDisplayPage(p,user,pageNum,sort,opt);
				if(page) await msg.edit({embed:page.embed});
			}else if(r.emoji.name===rewindEmoji){
				pageNum -= 5;
				if(pageNum<0) pageNum = 0;
				page = await getDisplayPage(p,user,pageNum,sort,opt);
				if(page) await msg.edit({embed:page.embed});
			}else if(r.emoji.name===fastForwardEmoji){
				pageNum += 5;
				if(pageNum>=page.maxPage) pageNum = page.maxPage-1;
				page = await getDisplayPage(p,user,pageNum,sort,opt);
				if(page) await msg.edit({embed:page.embed});
			}
			}
		}catch(err){}
	}

	collector.on('collect', handler);
	collector.on('end',async function(collected){
		if(page){
			page.embed.color = 6381923;
			await msg.edit("This message is now inactive",{embed:page.embed});
		}
	});

}

const declineEmoji = '👎';
const acceptEmoji = '👍';

/* Ask a user to display their weapon */
exports.askDisplay = async function(p, id){
	if(id==p.msg.author.id){
		display(p);
		return;
	}
	if(id==p.client.user.id){
		p.errorMsg("... trust me. You don't want to see what I have.",3000);
		return;
	}
	let member = await p.msg.guild.members.fetch(id);
	if(!member){
		p.errorMsg(", I couldn't find that user! :(",3000);
		return;
	}
	if(member.user.bot){
		p.errorMsg(", you dum dum! Bots don't carry weapons!",3000);
		return;
	}

	let embed = {
		"author":{
			"name":member.user.username+", "+p.msg.author.username+" wants to see your weapons!",
			"icon_url":p.msg.author.avatarURL()
		},
		"description":"Do you give permission for this user to view your weapons?",
		"color": p.config.embed_color,
	};

	let msg = await p.send({embed});

	await msg.react(acceptEmoji);
	await msg.react(declineEmoji);

	let filter = (reaction, user) => (reaction.emoji.name === acceptEmoji||reaction.emoji.name === declineEmoji) && user.id === member.id;
	let collector = msg.createReactionCollector(filter,{time:60000});
	collector.on('collect',async r => {
		collector.stop("done");
		if(r.emoji.name==declineEmoji){
			embed.color = 16711680;
			msg.edit({embed});
		}else{
			try{await msg.clearReactions();}catch(e){}
			display(p,0,0,{users:[p.msg.author.id],msg,user:member.user});
		}

	});

	collector.on('end',async function(collected,reason){
		if(reason!="done"){
			embed.color = 6381923;
			await msg.edit("This message is now inactive",{embed});
		}
	});
}

/* Gets a single page */
var getDisplayPage = async function(p,user,page,sort,opt={}){
	let {wid} = opt;
	/* Query all weapons */
	let sql = `SELECT temp.*,user_weapon_passive.wpid,user_weapon_passive.pcount,user_weapon_passive.stat as pstat
		FROM
			(SELECT user_weapon.uwid,user_weapon.wid,user_weapon.stat,animal.name,animal.nickname
			FROM  user
				INNER JOIN user_weapon ON user.uid = user_weapon.uid
				LEFT JOIN animal ON animal.pid = user_weapon.pid
			WHERE
				user.id = ${user.id} `;
			if(wid)
				sql += `AND user_weapon.wid = ${wid} `;
	sql += 		`ORDER BY `;

			if(sort===1)
				sql += 'user_weapon.avg DESC,';
			else if(sort===2)
				sql += 'user_weapon.wid DESC, user_weapon.avg DESC,';
			else if(sort===3)
				sql += 'user_weapon.pid DESC,';

	sql += 			` user_weapon.uwid DESC
			LIMIT ${weaponPerPage}
			OFFSET ${page*weaponPerPage}) temp
		LEFT JOIN
			user_weapon_passive ON temp.uwid = user_weapon_passive.uwid
	;`;
	sql += `SELECT COUNT(uwid) as count FROM user
			INNER JOIN user_weapon ON user.uid = user_weapon.uid
		WHERE
			user.id = ${user.id} `;
		if(wid)
			sql += `AND user_weapon.wid = ${wid} `;
	sql += ';';
	var result = await p.query(sql);

	/* out of bounds or no weapon */
	if(!result[0][0]){
		p.errorMsg(", you do not have any weapons, or the page is out of bounds",3000);
		return;
	}

	/* Parse total weapon count */
	let totalCount = result[1][0].count;
	let nextPage = (((page+1)*weaponPerPage)<=totalCount);
	let prevPage = (page>0);
	let maxPage = Math.ceil(totalCount/weaponPerPage);


	/* Parse all weapons */
	let user_weapons = parseWeaponQuery(result[0]);

	/* Parse actual weapon data for each weapon */
	let desc = "Description: `owo weapon {weaponID}`\nEquip: `owo weapon {weaponID} {animal}`\nUnequip: `owo weapon unequip {weaponID}`\nSell `owo sell {weaponID|commonweapons,rareweapons...}`\n";
	for(var key in user_weapons){
		let weapon = parseWeapon(user_weapons[key]);
		if(weapon){
			let emoji = `${weapon.rank.emoji}${weapon.emoji}`;
			for(var i=0;i<weapon.passives.length;i++){
				let passive = weapon.passives[i];
				emoji += passive.emoji;
			}
			desc += `\n\`${user_weapons[key].uwid}\` ${emoji} **${weapon.name}** | Quality: ${weapon.avgQuality}%`;
			if(user_weapons[key].animal.name){
				let animal = p.global.validAnimal(user_weapons[key].animal.name);
				desc += ` | ${(animal.uni)?animal.uni:animal.value} ${(user_weapons[key].animal.nickname)?user_weapons[key].animal.nickname:""}`;
			}
		}
	}
	/* Construct msg */
	let title = user.username+"'s "+((wid)?weapons[wid].name:"weapons");
	let embed = {
		"author":{
			"name":title,
			"icon_url":user.avatarURL()
		},
		"description":desc,
		"color": p.config.embed_color,
		"footer":{
			"text":"Page "+(page+1)+"/"+maxPage+" | "
		}
	};

	if(sort===0)
		embed.footer.text += "Sorting by id";
	else if(sort===1)
		embed.footer.text += "Sorting by rarity";
	else if(sort===2)
		embed.footer.text += "Sorting by type";
	else if(sort===3)
		embed.footer.text += "Sorting by equipped";

	return {sql,embed,totalCount,nextPage,prevPage,maxPage}
}

exports.describe = async function(p,uwid){
	uwid = expandUWID(uwid);

	/* Check if valid */
	if(!uwid){
		p.errorMsg(", I could not find a weapon with that unique weapon id! Please use `owo weapon` for the weapon ID!");
		return;
	}

	/* sql query */
	let sql = `SELECT user.id,a.uwid,a.wid,a.stat,b.pcount,b.wpid,b.stat as pstat FROM user INNER JOIN user_weapon a ON user.uid = a.uid LEFT JOIN user_weapon_passive b ON a.uwid = b.uwid WHERE a.uwid = ${uwid};`;
	let result = await p.query(sql);

	/* Check if valid */
	if(!result[0]){
		p.errorMsg(", I could not find a weapon with that unique weapon id! Please use `owo weapon` for the weapon ID!");
		return;
	}

	/* parse weapon to get info */
	let weapon = this.parseWeaponQuery(result);
	weapon = weapon[Object.keys(weapon)[0]];
	weapon = this.parseWeapon(weapon);

	/* If no weapon */
	if(!weapon){
		p.errorMsg(", I could not find a weapon with that unique weapon id! Please use `owo weapon` for the weapon ID!");
		return;
	}

	/* Parse image url */
	let url = weapon.emoji;
	if(temp = url.match(/:[0-9]+>/)){
		temp = "https://cdn.discordapp.com/emojis/"+temp[0].match(/[0-9]+/)[0]+".";
		if(url.match(/<a:/))
			temp += "gif";
		else
			temp += "png";
		url = temp;
	}

	// Grab user
	let user = await p.global.getUser(result[0].id);
	let username = "A User";
	if(user) username = user.username;

	/* Make description */
	let desc = `**Name:** ${weapon.name}\n`;
	desc += `**Owner:** ${username}\n`;
	desc += `**ID:** \`${shortenUWID(uwid)}\`\n`;
	desc += `**Sell Value:** ${weapon.unsellable?"UNSELLABLE":prices[weapon.rank.name]}\n`;
	desc += `**Quality:** ${weapon.rank.emoji} ${weapon.avgQuality}%\n`;
	desc += `**WP Cost:** ${Math.ceil(weapon.manaCost)} <:wp:531620120976687114>`;
	desc += `\n**Description:** ${weapon.desc}\n`;
	if(weapon.buffList.length>0){
		desc += `\n`;
		let buffs = weapon.getBuffs();
		for(let i in buffs){
			desc += `${buffs[i].emoji} **${buffs[i].name}** - ${buffs[i].desc}\n`;
		}
	}
	if(weapon.passives.length<=0)
		desc += `\n**Passives:** None`;
	for(var i=0;i<weapon.passives.length;i++){
		let passive = weapon.passives[i];
		desc += `\n${passive.emoji} **${passive.name}** - ${passive.desc}`;
	}

	/* Construct embed */
	const embed ={
		"author":{
			"name":username+"'s "+weapon.name,
		},
		"color":p.config.embed_color,
		"thumbnail":{
			"url":url
		},
		"description":desc
	};
	if(user) embed.author.icon_url = user.avatarURL();
	p.send({embed});
}

exports.equip = async function(p,uwid,pet){
	uwid = expandUWID(uwid);
	if(!uwid){
		p.errorMsg(", could not find that weapon or animal! The correct command is `owo weapon {weaponID} {animal}`\n"+p.config.emoji.blank+" **|** The weaponID can be found in the command `owo weapon`");
		return;
	}
	/* Construct sql depending in pet parameter */
	if(p.global.isInt(pet)){
		var pid = `(SELECT pid FROM user a LEFT JOIN pet_team b ON a.uid = b.uid LEFT JOIN pet_team_animal c ON b.pgid = c.pgid WHERE a.id = ${p.msg.author.id} AND pos = ${pet})`
	}else{
		var pid = `(SELECT pid FROM animal WHERE name = '${pet.value}' AND id = ${p.msg.author.id})`;
	}
	let sql = `UPDATE IGNORE user_weapon SET pid = NULL WHERE
			uid = (SELECT uid FROM user WHERE id = ${p.msg.author.id}) AND
			pid = ${pid} AND
			(SELECT * FROM (SELECT uwid FROM user_weapon WHERE uid = (SELECT uid FROM user WHERE id = ${p.msg.author.id}) AND uwid = ${uwid}) a) IS NOT NULL;`
	sql += `UPDATE IGNORE user_weapon SET
			pid = ${pid}
		WHERE
			uid = (SELECT uid FROM user WHERE id = ${p.msg.author.id}) AND
			uwid = ${uwid} AND
			${pid} IS NOT NULL;`;
	sql += `SELECT animal.name,animal.nickname,a.uwid,a.wid,a.stat,b.pcount,b.wpid,b.stat as pstat FROM user_weapon a LEFT JOIN user_weapon_passive b ON a.uwid = b.uwid LEFT JOIN animal ON a.pid = animal.pid WHERE a.uwid = ${uwid} AND uid = (SELECT uid FROM user WHERE id = ${p.msg.author.id});`;
	let result = await p.query(sql);

	/* Success */
	if(result[1].changedRows>0){
		let animal = p.global.validAnimal(result[2][0].name);
		let nickname = result[2][0].nickname;
		let weapon = this.parseWeaponQuery(result[2]);
		weapon = weapon[Object.keys(weapon)[0]];
		weapon = this.parseWeapon(weapon);
		if(weapon)
			p.replyMsg(weaponEmoji,`, ${(animal.uni)?animal.uni:animal.value} **${(nickname)?nickname:animal.name}** is now wielding ${weapon.emoji} **${weapon.name}**!`);
		else
			p.errorMsg(`, Could not find a weapon with that id!`);

	/* Already equipped */
	}else if(result[1].affectedRows>0){
		let animal = p.global.validAnimal(result[2][0].name);
		let nickname = result[2][0].nickname;
		let weapon = this.parseWeaponQuery(result[2]);
		weapon = weapon[Object.keys(weapon)[0]];
		weapon = this.parseWeapon(weapon);
		if(weapon)
			p.replyMsg(weaponEmoji,`, ${(animal.uni)?animal.uni:animal.value} **${(nickname)?nickname:animal.name}** is already wielding ${weapon.emoji} **${weapon.name}**!`);
		else
			p.errorMsg(`, Could not find a weapon with that id!`);

	/* A Failure (like me!) */
	}else{
		p.errorMsg(", could not find that weapon or animal! The correct command is `owo weapon {weaponID} {animal}`\n"+p.config.emoji.blank+" **|** The weaponID can be found in the command `owo weapon`");
	}
}

exports.unequip = async function(p,uwid){
	uwid  = expandUWID(uwid);
	if(!uwid){
		p.errorMsg(`, Could not find a weapon with that id!`);
		return;
	}

	let sql = `SELECT animal.name,animal.nickname,a.uwid,a.wid,a.stat,b.pcount,b.wpid,b.stat as pstat FROM user_weapon a LEFT JOIN user_weapon_passive b ON a.uwid = b.uwid LEFT JOIN animal ON a.pid = animal.pid WHERE a.uwid = ${uwid} AND uid = (SELECT uid FROM user WHERE id = ${p.msg.author.id});`;
	sql += `UPDATE IGNORE user_weapon SET pid = NULL WHERE uwid = ${uwid} AND uid = (SELECT uid FROM user WHERE id = ${p.msg.author.id});`;
	let result =  await p.query(sql);

	/* Success */
	if(result[1].changedRows>0){
		let animal = p.global.validAnimal(result[0][0].name);
		let nickname = result[0][0].nickname;
		let weapon = this.parseWeaponQuery(result[0]);
		weapon = weapon[Object.keys(weapon)[0]];
		weapon = this.parseWeapon(weapon);
		if(weapon)
			p.replyMsg(weaponEmoji,`, Unequipped ${weapon.emoji} **${weapon.name}** from ${(animal.uni)?animal.uni:animal.value} **${(nickname)?nickname:animal.name}**`);
		else
			p.errorMsg(`, Could not find a weapon with that id!`);

	/* No body using weapon */
	}else if(result[1].affectedRows>0){
		let weapon = this.parseWeaponQuery(result[0]);
		weapon = weapon[Object.keys(weapon)[0]];
		weapon = this.parseWeapon(weapon);
		if(weapon)
			p.replyMsg(weaponEmoji,`, No animal is using ${weapon.emoji} **${weapon.name}**`);
		else
			p.errorMsg(`, Could not find a weapon with that id!`);

	/* Invalid */
	}else{
		p.errorMsg(`, Could not find a weapon with that id!`);
	}
}

/* Sells a weapon */
exports.sell = async function(p,uwid){
	/* Check if we're selling a rank */
	uwid = uwid.toLowerCase();
	for(let i=0;i<ranks.length;i++){
		if(ranks[i].includes(uwid)){
			sellRank(p,i);
			return;
		}
	}

	uwid = expandUWID(uwid);
	if(!uwid){
		p.errorMsg(", you do not have a weapon with this id!",3000);
		return;
	}

	/* Grab the item we will sell */
	let sql = `SELECT a.uwid,a.wid,a.stat,b.pcount,b.wpid,b.stat as pstat,c.name,c.nickname
		FROM user
			LEFT JOIN user_weapon a ON user.uid = a.uid
			LEFT JOIN user_weapon_passive b ON a.uwid = b.uwid
			LEFT JOIN animal c ON a.pid = c.pid
		WHERE user.id = ${p.msg.author.id} AND a.uwid = ${uwid};`

	let result = await p.query(sql);

	/* not a real weapon! */
	if(!result[0]){
		p.errorMsg(", you do not have a weapon with this id!",3000);
		return;
	}

	/* If an animal is using the weapon */
	if(result[0]&&result[0].name){
		p.errorMsg(", please unequip the weapon to sell it!",3000);
		return;
	}

	/* Parse stats to determine price */
	let weapon = this.parseWeaponQuery(result);
	for(var key in weapon){
		weapon = this.parseWeapon(weapon[key]);
	}

	if(!weapon){
		p.errorMsg(", you do not have a weapon with this id!",3000);
		return;
	}

	/* Is this weapon sellable? */
	if(weapon.unsellable){
		p.errorMsg(", This weapon cannot be sold!");
		return;
	}

	/* Get weapon price */
	let price = prices[weapon.rank.name];
	if(!price){
		p.errorMsg(", Something went terribly wrong...");
		return;
	}

	sql = `DELETE user_weapon_passive FROM user
		LEFT JOIN user_weapon ON user.uid = user_weapon.uid
		LEFT JOIN user_weapon_passive ON user_weapon.uwid = user_weapon_passive.uwid
		WHERE id = ${p.msg.author.id}
			AND user_weapon_passive.uwid = ${uwid}
			AND user_weapon.pid IS NULL;`;
	sql += `DELETE user_weapon FROM user
		LEFT JOIN user_weapon ON user.uid = user_weapon.uid
		WHERE id = ${p.msg.author.id}
			AND user_weapon.uwid = ${uwid}
			AND user_weapon.pid IS NULL;`;

	result = await p.query(sql);

	/* Check if deleted */
	if(result[1].affectedRows==0){
		p.errorMsg(", you do not have a weapon with this id!",3000);
		return;
	}

	/* Give cowoncy */
	sql = `UPDATE cowoncy SET money = money + ${price} WHERE id = ${p.msg.author.id}`;
	result = await p.query(sql);

	p.replyMsg(weaponEmoji,`, You sold a(n) **${weapon.rank.name} ${weapon.name}**  ${weapon.rank.emoji}${weapon.emoji} for **${price}** cowoncy!`);
}

var sellRank = exports.sellRank = async function(p,rankLoc){
	// (min,max]
	let min = 0,max = 0;
	for(let i=0;i<=rankLoc;i++){
		let rank = WeaponInterface.ranks[i];
		min = max;
		max += rank[0];
	}
	min *= 100;
	max *= 100;

	/* Grab the item we will sell */
	let sql = `SELECT a.uwid,a.wid,a.stat,b.pcount,b.wpid,b.stat as pstat
		FROM user
			LEFT JOIN user_weapon a ON user.uid = a.uid
			LEFT JOIN user_weapon_passive b ON a.uwid = b.uwid
		WHERE user.id = ${p.msg.author.id} AND avg > ${min} AND avg <= ${max} AND a.pid IS NULL LIMIT 500;`

	let result = await p.query(sql);

	/* not a real weapon! */
	if(!result[0]){
		p.errorMsg(", you do not have any weapons with this rank!",3000);
		return;
	}

	/* Parse emoji and uwid */
	let weapon = parseWeaponQuery(result);
	let weapons = [];
	let weaponsSQL = [];
	let price;
	let rank;
	for(var key in weapon){
		let tempWeapon = parseWeapon(weapon[key]);
		if(!tempWeapon.unsellable){
			weapons.push(tempWeapon.emoji);
			weaponsSQL.push(tempWeapon.ruwid);
		}
		/* Get weapon price */
		if(!price){
			price = prices[tempWeapon.rank.name];
			rank = tempWeapon.rank.emoji+" **"+tempWeapon.rank.name+"**";
		}
	}
	weaponsSQL = '('+weaponsSQL.join(',')+')';

	if(weapons.length<=0){
		p.errorMsg(", you do not have any weapons with this rank!",3000);
		return;
	}

	if(!price){
		p.errorMsg(", Something went terribly wrong...");
		return;
	}

	sql = `DELETE user_weapon_passive FROM user
		LEFT JOIN user_weapon ON user.uid = user_weapon.uid
		LEFT JOIN user_weapon_passive ON user_weapon.uwid = user_weapon_passive.uwid
		WHERE id = ${p.msg.author.id}
			AND user_weapon_passive.uwid IN ${weaponsSQL}
			AND user_weapon.pid IS NULL;`;
	sql += `DELETE user_weapon FROM user
		LEFT JOIN user_weapon ON user.uid = user_weapon.uid
		WHERE id = ${p.msg.author.id}
			AND user_weapon.uwid IN ${weaponsSQL}
			AND user_weapon.pid IS NULL;`;

	result = await p.query(sql);

	/* Check if deleted */
	if(result[1].affectedRows==0){
		p.errorMsg(", you do not have a weapon with this id!",3000);
		return;
	}

	/* calculate rewards */
	price *= result[1].affectedRows;

	/* Give cowoncy */
	sql = `UPDATE cowoncy SET money = money + ${price} WHERE id = ${p.msg.author.id}`;
	result = await p.query(sql);

	p.replyMsg(weaponEmoji,`, You sold all your ${rank} weapons for **${price}** cowoncy!\n${p.config.emoji.blank} **| Sold:** ${weapons.join('')}`);
}

/* Shorten a uwid to base36 */
var shortenUWID = exports.shortenUWID = function(uwid){
	if(!uwid) return;
	return uwid.toString(36).toUpperCase();
}

/* expand base36 to decimal */
var expandUWID = exports.expandUWID = function(euwid){
	if(!euwid) return;
	euwid = euwid+'';
	if(!(/^[a-zA-Z0-9]+$/.test(euwid))) return;
	return parseInt(euwid.toLowerCase(),36);
}

exports.getWID = function(id){
	return weapons[id];
}
