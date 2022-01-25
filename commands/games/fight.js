const Discord = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('fight', {
			aliases: ['fight'],
			category: 'games',
			channel: 'guild',
			description: 'Fight against other members!',
			args: [
				{
					id: 'user',
					type: 'member'
				}
			]
		});
	}

	async exec(message, { user }) {
		await this.client.weky.Fight({
			message: message,
			opponent: user,
			embed: {
				title: "Fight",
				color: this.client.config.discord.accentColor,
				footer: (await this.client.language('This is just a game.', message)),
				timestamp: true,
			},
			buttons: {
				hit: (await this.client.language('Hit', message)),
				heal: (await this.client.language('Heal', message)),
				cancel: (await this.client.language('Run away', message)),
				accept: (await this.client.language('Accept', message)),
				deny: (await this.client.language('Deny', message)),
			},
			acceptMessage: '<@{{challenger}}> has challenged <@{{opponent}}> for a fight!',
			winMessage: 'GG, <@{{winner}}> won the fight!',
			endMessage: "<@{{opponent}}> didn't answer in time. So, I dropped the game!",
			cancelMessage: '<@{{opponent}}> refused to have a fight with you!',
			fightMessage: '{{player}} you go first!',
			opponentsTurnMessage: (await this.client.language('Please wait for your opponents move!', message)),
			highHealthMessage: (await this.client.language('You cannot heal if your HP is above 80!', message)),
			lowHealthMessage: (await this.client.language('You cannot run away if your HP is below 50!', message)),
			returnWinner: true,
			othersMessage: 'Only {{author}} can use the buttons!',
		});
	}
};
