const Discord = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('fastclick', {
			aliases: ['fast-click'],
			category: 'games',
			channel: 'guild',
			description: 'autoclicekr',
		});
	}

	async exec(message) {
		await this.client.weky.QuickClick({
			message: message,
			embed: {
				title: 'Quick Click',
				color: this.client.config.discord.accentColor,
				footer: 'This is just a game.',
				timestamp: true,
			},
			time: 60000,
			waitMessage: 'The buttons may appear anytime now!',
			startMessage: 'First person to press the correct button will win. You have **{{time}}**!',
			winMessage: '<@{{winner}}> pressed the button in **{{time}}**.',
			loseMessage: 'No one pressed the button in time. So, I dropped the game!',
			emoji: '👆',
			ongoingMessage: 'A game is already runnning in <#{{channel}}>. You can\'t start a new one!',
		});
	}
};
