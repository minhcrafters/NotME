const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('flip', {
			aliases: ['flip'],
			category: 'util',
			description: 'Flips a given string.',
			args: [
				{
					id: 'text',
					match: 'content',
					type: 'string',
				},
			],
		});
	}

	async exec(message, { text }) {
		message.reply(this.client.functions.flipText(text));
	}
};
