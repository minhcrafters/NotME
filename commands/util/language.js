const Commando = require('discord-akairo');
const ISO6391 = require('iso-639-1');
const functions = require('../../utils/functions.js');
const db = require('quick.db');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('language', {
			aliases: ['language', 'lang', 'langset'],
			category: 'util',
			channel: 'guild',
			description: 'Sets the bot\'s language for this server.',
			userPermissions: ['ADMINISTRATOR'],
			args: [
				{
					id: 'lang',
					prompt: {
						start: 'Please specify a language.',
						retry: 'Invalid language!'
					},
					type: 'string',
					default: 'en'
				}
			]
		});
	}

	async exec(message, { lang }) {
		if (!ISO6391.getName(lang) || ISO6391.getName(lang) == '') {
			try {
				lang = ISO6391.getCode(lang);
			} catch {
				return message.channel.send(`${this.client.emotes.error} - Invalid language!`);
			}
		}

		db.set(`${message.guild.id}.lang`, lang);
		
		return message.channel.send(`${this.client.emotes.success} - Language has been set to **${ISO6391.getName(lang) ? ISO6391.getName(lang) : functions.toTitleCase(lang)}**!`);
		// message.channel.send('Language system is currently in maintainence!');
	}
};
