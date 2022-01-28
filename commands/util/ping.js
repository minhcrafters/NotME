const { oneLine } = require('common-tags');
const { Command } = require('discord-akairo');

module.exports = class PingCommand extends Command {
	constructor() {
		super('ping', {
			aliases: ['ping'],
			category: 'util',
			description: 'Checks the bot\'s ping to the Discord server.',
			ratelimit: 5,
			cooldown: 10,
		});
	}

	async exec(message) {
		const pingMsg = await message.reply('Pinging...');
		return pingMsg.edit(oneLine`
			🏓 | Pong! The message round-trip took ${
				(pingMsg.editedTimestamp || pingMsg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)
			}ms.
			${this.client.ws.ping ? `The heartbeat ping is ${Math.round(this.client.ws.ping)}ms.` : ''}
		`);
	}
};