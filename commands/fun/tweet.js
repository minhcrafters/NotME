const Memer = require('srod-v2');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('tweet', {
			aliases: ['tweet'],
			category: 'fun',
			channel: 'guild',
			description: 'Returns fake Twitter tweets.',
			args: [
				{
					id: 'user',
					type: 'member',
				},
				{
					id: 'text',
					type: 'string',
				},
			],
		});
	}

	async exec(message, { user, text }) {
		var options = {
			Name: user.user.username,
			Tweet: text,
			Color: this.client.config.discord.accentColor,
		};

		const data = await Memer.Tweet(options);

		message.channel.send({ embeds: [data.embed] });
	}
};
