/*
 * OwO Bot for Discord
 * Copyright (C) 2019 Christopher Thai
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
  */

const CommandInterface = require('../../commandinterface.js');

const imagegen = require('../../../../tokens/imagegen.json');
const offsetID = 200;
const nextPageEmoji = '➡';
const prevPageEmoji = '⬅';
const buyEmoji = '🖼';

module.exports = new CommandInterface({

	alias:["wallpaper","wp","wallpapers","background","backgrounds"],

	args:"{id}",

	desc:"View your current wallpapers! Equipped them by clicking the wallpaper emoji.\nYou can buy more wallpapers from the shop.",

	example:["owo wallpaper","owo wallpaper 201"],

	related:["owo shop","owo profile"],

	permissions:["SEND_MESSAGES","EMBED_LINKS","ATTACH_FILES","ADD_REACTIONS"],

	cooldown:15000,

	execute: async function(p){
		let totalPages = await getTotalPages(p);
		let currentPage = 1;
		let page = await createPage(p,currentPage,totalPages);
		let msg = await p.send(page);

		if(totalPages<=0) return;

		let filter = (reaction,user) => (reaction.emoji.name===buyEmoji||reaction.emoji.name===nextPageEmoji||reaction.emoji.name===prevPageEmoji)&&user.id==p.msg.author.id;
		let collector = await msg.createReactionCollector(filter,{time:180000});

		await msg.react(prevPageEmoji);
		await msg.react(nextPageEmoji);
		await msg.react(buyEmoji);

		collector.on('collect', async function(r){
			if(r.emoji.name===nextPageEmoji) {
				if(currentPage<totalPages) currentPage++;
				else currentPage = 1;
				page = await createPage(p,currentPage,totalPages);
				await msg.edit(page);
			}else if(r.emoji.name===prevPageEmoji){
				if(currentPage>1) currentPage--;
				else currentPage = totalPages;
				page = await createPage(p,currentPage,totalPages);
				await msg.edit(page);
			}else if(r.emoji.name==buyEmoji){
				if(page.embed.bid){
					let sql = `INSERT INTO user_profile (uid,bid) VALUES ((SELECT uid FROM user WHERE id = ${p.msg.author.id}),${page.embed.bid}) ON DUPLICATE KEY UPDATE bid = ${page.embed.bid};`;
					await p.query(sql);
					page = await createPage(p,currentPage,totalPages);
					await msg.edit(page);
				}
			}
		});

		collector.on('end',async function(collected){
			page = await createPage(p,currentPage,totalPages);
			page.embed.color = 6381923;
			await msg.edit("This message is now inactive",page);
		});
	}

});

async function createPage(p,page,totalPages){
	let sql = `SELECT b.*,up.uid AS profile FROM user u INNER JOIN user_backgrounds ub ON u.uid = ub.uid INNER JOIN backgrounds b ON ub.bid = b.bid LEFT JOIN user_profile up ON u.uid = up.uid AND up.bid = ub.bid WHERE id = ${p.msg.author.id} ORDER BY ub.bid LIMIT 1 OFFSET ${page-1}`;
	let result = await p.query(sql);

	embed = {
		"author":{
			"name":p.msg.author.username+"'s wallpapers",
			"icon_url":p.msg.author.avatarURL()
		},
		"color": 4886754,
		"footer":{
			"text":"Page "+page+"/"+totalPages
		}
	}

	if(result[0]){
		embed.description = "`"+(offsetID+result[0].bid)+"` **"+result[0].bname+"**";
		embed.image = {
			"url":imagegen.assetUrl+"/background/"+result[0].bid+".png"
		};
		if(result[0].profile)
			embed.description += "   *Currently Equipped*";
		embed.bid = result[0].bid;
	}else{
		embed.description = "You don't have any wallpapers! :c Purchase one in `owo shop`!";
		delete embed.footer;
	}

	return {embed};
}

async function getTotalPages(p){
	let sql = `SELECT COUNT(bid) AS count FROM user u INNER JOIN user_backgrounds ub ON u.uid = ub.uid WHERE id = ${p.msg.author.id};`;
	let result = await p.query(sql);
	return result[0].count;
}
