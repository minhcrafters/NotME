const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('reverse', {
			aliases: ['reverse', 'invert'],
			category: 'util',
			description: 'Reverse a given string.',
			args: [
				{
					id: 'text',
					type: 'string',
					match: 'content'
				},
			],
		});
	}

	async exec(message, { text }) {
		return message.reply(text.split('').reverse().join(''));
	}
};
