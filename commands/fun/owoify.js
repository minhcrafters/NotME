const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('owoify', {
			aliases: ['owoify'],
			category: 'fun',
			description: 'OwOify a given string.',
			args: [
				{
					id: 'text',
					type: 'string',
				},
			],
		});
	}

	async exec(message, { text }) {
		let data = await this.client.nekos.sfw.OwOify({ text: text });

		message.channel.send(data.owo);
	}
};
