const Discord = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('snake', {
			aliases: ['snake'],
			category: 'games',
			channel: 'guild',
			description: 'Play the snake game.',
		});
	}

	async exec(message) {
		await this.client.weky.Snake({
			message: message,
			embed: {
				title: 'Snake',
				description: 'GG, you scored **{{score}}** points!',
				color: this.client.config.discord.accentColor,
				footer: 'This is just a game.',
				timestamp: true,
			},
			emojis: {
				empty: '⬛',
				snakeBody: '🟩',
				food: '🍎',
				up: '⬆️',
				right: '⬅️',
				down: '⬇️',
				left: '➡️',
			},
			othersMessage: 'Only <@{{author}}> can use the buttons!',
			buttonText: 'Cancel',
		});
	}
};
