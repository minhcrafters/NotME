const Discord = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('roshambo', {
			aliases: ['roshambo', 'rock-paper-scissors', 'rps'],
			category: 'games',
			channel: 'guild',
			description: 'Play Rock Paper Scissors with your friend!',
			args: [
				{
					id: 'user',
					type: 'member'
				}
			]
		});
	}

	async exec(message, { user }) {
		await this.client.weky.RockPaperScissors({
			message: message,
			opponent: user,
			embed: {
				title: 'Roshambo (Rock Paper Scissors)',
				description: 'Press the button below to choose your element.',
				color: this.client.config.discord.accentColor,
				footer: 'roshambo les go',
				timestamp: true,
			},
			buttons: {
				rock: (await this.client.language("Rock", message)),
				paper: (await this.client.language("Paper", message)),
				scissors: (await this.client.language("Scissors", message)),
				accept: (await this.client.language("Accept", message)),
				deny: (await this.client.language("Deny", message)),
			},
			time: 60000,
			acceptMessage: '<@{{challenger}}> has challenged <@{{opponent}}> for a game of Roshambo!',
			winMessage: '<@{{winner}}> won!',
			drawMessage: 'This game is deadlock!',
			endMessage: "<@{{opponent}}> didn't answer in time. So, I dropped the game!",
			timeEndMessage: "Both of you didn't pick something in time. So, I dropped the game!",
			cancelMessage: '<@{{opponent}}> refused to have a game of Roshambo with you!',
			choseMessage: 'You picked {{emoji}}',
			noChangeMessage: 'You cannot change your selection!',
			othersMessage: 'Only {{author}} can use the buttons!',
			returnWinner: false,
		});
	}
};
