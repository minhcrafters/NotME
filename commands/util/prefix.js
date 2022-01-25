const { stripIndents } = require('common-tags');
const Commando = require('discord-akairo');
const db = require('quick.db');

module.exports = class PrefixCommand extends Commando.Command {
	constructor() {
		super('prefix', {
			aliases: ['prefix'],
			category: 'util',
			description: 'Shows or sets the command prefix.',
			// format: '[prefix/"default"/"none"]',
			// details: `
			// 	If no prefix is provided, the current prefix will be shown.
			// 	If the prefix is "default", the prefix will be reset to the bot's default prefix.
			// 	If the prefix is "none", the prefix will be removed entirely, only allowing mentions to run commands.
			// 	Only administrators may change the prefix.
			// `,
			// examples: ['prefix', 'prefix -', 'prefix omg!', 'prefix default', 'prefix none'],
			args: [
				{
					id: 'prefix',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async exec(message, args) {
		if (args.prefix == '' || !args.prefix) {
			const prefix = db.get(message.guild.id, 'prefix');
			return message.reply(`${prefix ? `The command prefix is \`${prefix}\`.` : 'There is no command prefix.'}\n.`);
		}

		if (message.guild) {
			if (!message.member.permissions.has('ADMINISTRATOR') && !this.client.isOwner(message.author)) {
				return message.reply('Only administrators may change the command prefix.');
			}
		} else if (!this.client.isOwner(message.author)) {
			return message.reply('Only the bot owner(s) may change the global command prefix.');
		}

		const lowercase = args.prefix.toLowerCase();
		const prefix = lowercase === 'none' ? '' : args.prefix;
		let response;

		if (lowercase === 'default') {
			// await this.client.settings.set(message.guild.id, 'prefix', 'me!');
			db.set(`${message.guild.id}.prefix`, this.client.config.discord.prefix);
			response = `Reset the command prefix to the default (currently \`${this.client.config.discord.prefix}\`).`;
		} else {
			// await this.client.settings.set(message.guild.id, 'prefix', prefix);
			db.set(`${message.guild.id}.prefix`, prefix);
			response = prefix ? `Set the command prefix to \`${args.prefix}\`.` : 'Removed the command prefix entirely.';
		}

		return message.reply(response);
	}
};