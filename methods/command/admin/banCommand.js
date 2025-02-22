/*
 * OwO Bot for Discord
 * Copyright (C) 2019 Christopher Thai
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
  */

const CommandInterface = require('../../commandinterface.js');

const sender = require('../../../util/sender.js');
const ban = require('../../../util/ban.js');

module.exports = new CommandInterface({

	alias:["bancommand","bc"],

	admin:true,
	mod:true,
	dm:true,

	execute: async function(p){

		// Check if enough arguments
		if(p.args.length<2){
			p.errorMsg(", Invalid arguments!");
			return;
		}

		// Check if its an id
		let user = await p.global.getUser(p.args[0]);
		if(!user){
			p.errorMsg(", Invalid user");
			return;
		}

		// Check if its a valid command
		let command;
		command = p.aliasToCommand[p.args[1]];
		if(!command){
			p.errorMsg(", That is not a command!");
			return;
		}

		// Parse reason
		let reason = p.args.slice(2).join(" ");
		if(!reason||reason=="")
			reason = "no reason given";

		await ban.banCommand(p,user,command,reason);
	}

})
