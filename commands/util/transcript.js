const Commando = require('discord-akairo');
const { MessageAttachment } = require('discord.js');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('transcript', {
			aliases: ['transcript'],
			category: 'util',
			channel: 'guild',
			description: 'Generates a discord-like transcript.',
		});
	}

	async exec(message) {
		const data = await this.client.functions.generateTranscript(message.channel, message.guild, await message.channel.messages.fetch({ limit: 100 }));

		this.client.app.get('/transcript')

		const file = new MessageAttachment(data, 'index.html');
		
		return message.channel.send({ files: [file] });
	}
};
