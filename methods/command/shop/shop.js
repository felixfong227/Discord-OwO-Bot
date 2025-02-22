/*
 * OwO Bot for Discord
 * Copyright (C) 2019 Christopher Thai
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
  */

const CommandInterface = require('../../commandinterface.js');

const shopUtil = require('./util/shopUtil.js');
const PageClass = require('./PageClass.js');
const requireDir = require('require-dir');
const dir = requireDir('./pages',{recurse:true});
const nextPageEmoji = '➡';
const prevPageEmoji = '⬅';

var initialPages = [];
for(let key in dir){
	if(new dir[key]() instanceof PageClass){
		initialPages.splice((new dir[key]()).id,0,dir[key]);
	}
}

module.exports = new CommandInterface({

	alias:["shop","market"],

	args:"",

	desc:"Spend your cowoncy for some items!",

	example:[],

	related:["owo money"],

	permissions:["SEND_MESSAGES","EMBED_LINKS","ATTACH_FILES","ADD_REACTIONS"],

	cooldown:15000,

	execute: async function(p){
		if(p.args.length&&["wallpaper","wp","wallpapers","background","backgrounds"].includes(p.args[0].toLowerCase())){
			await shopUtil.displayWallpaperShop(p);
		}else{
			await displayShop(p);
		}
	}
});

async function displayShop(p){
		let pages = await initPages(p);

		let embed = await getPage(p,pages);
		let msg = await p.send({embed});	
		let filter = (reaction,user) => (reaction.emoji.name===nextPageEmoji||reaction.emoji.name===prevPageEmoji)&&user.id==p.msg.author.id;
		let collector = await msg.createReactionCollector(filter,{time:180000});

		await msg.react(prevPageEmoji);
		await msg.react(nextPageEmoji);

		collector.on('collect', async function(r){
			if(r.emoji.name===nextPageEmoji) {
				if(pages.currentPage<pages.totalPages) pages.currentPage++;
				else pages.currentPage = 1;
				embed = await getPage(p,pages);
				await msg.edit({embed});
			}
			else if(r.emoji.name===prevPageEmoji){
				if(pages.currentPage>1) pages.currentPage--;
				else pages.currentPage = pages.totalPages;
				embed = await getPage(p,pages);
				await msg.edit({embed});
			}
		});

		collector.on('end',async function(collected){
			embed = await getPage(p,pages);
			embed.color = 6381923;
			await msg.edit("This message is now inactive",{embed});
		});
}

async function getPage(p,pages){
	let embed = {
		"author":{
			"icon_url":p.msg.author.avatarURL()
		},
		"color": 4886754,
		"footer":{
			"text": "Page "+pages.currentPage+"/"+pages.totalPages
		}
	};
	let tempPage = pages.currentPage;
	for(let i in pages.pages){
		let page = pages.pages[i];
		if(tempPage <= page.totalPages){
			return await page.getPage(tempPage,embed);
		}else{
			tempPage -= page.totalPages;
		}
	}
}

async function initPages(p){
	let pages = [];
	let totalPages = 0;
	for(let i in initialPages){
		let page = new initialPages[i](p);
		let pageNum = await page.totalPages();
		totalPages += pageNum;
		page.totalPages = totalPages;
		pages.push(page);
	}

	return {totalPages,pages,currentPage:1};
}
