const Discord = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('would-you-rather', {
			aliases: ['would-you-rather', 'wyr'],
			category: 'games',
			channel: 'guild',
			description: 'Would you rather...',
		});
	}

	async exec(message) {
		await this.client.weky.WouldYouRather({
			message: message,
			embed: {
				title: (await this.client.language('Would you rather...', message)),
				color: this.client.config.discord.accentColor,
				footer: 'reeeee',
				timestamp: true,
			},
			thinkMessage: (await this.client.language("I'm thinking", message)),
			othersMessage: 'Only <@{{author}}> can use the buttons!',
			buttons: { optionA: (await this.client.language('Option A', message)), optionB: (await this.client.language('Option B', message)) },
		});
	}
};
