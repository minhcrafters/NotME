const db = require('quick.db');

const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('chatbot', {
			aliases: ['chatbot'],
			category: 'util',
			channel: 'guild',
			description: 'Use the chatbot feature.',
			args: [
				{
					id: 'channel',
					prompt: {
						start: 'Which text channel would you like to set my chatbot feature to?'
					},
					type: 'textChannel',
					default: null,
				},
			],
			userPermissions: ['MANAGE_CHANNELS'],
		});
	}

	async exec(message, { channel }) {
		if (!channel) {
			db.delete(`${message.guild.id}.chatbotChannel`);
			return message.channel.send(`${this.client.emotes.success} - Chatbot feature has been turned off.`);
		}

		db.set(`${message.guild.id}.chatbotChannel`, `${channel.id}`);

		return message.channel.send(`${this.client.emotes.success} - Successfully set the chatbot channel to ${channel.toString()}!`);
	}
};
