const functions = require('../../utils/functions.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('sudo', {
			aliases: ['sudo'],
			category: 'util',
			channel: 'guild',
			description: 'Stands for superuser do.',
			clientPermissions: ['MANAGE_MESSAGES', 'MANAGE_WEBHOOKS'],
			userPermissions: ['ADMINISTRATOR'],
			args: [
				{
					id: 'text',
					match: 'content',
					type: 'string'
				}
			]
		});
	}

	async exec(message, args) {		
		await this.client.weky.Sudo({
			message: message,
			member: message.mentions.members.first(),
			text: args.text,
			deleteMessage: true
		});
	}
};
