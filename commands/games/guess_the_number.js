const Discord = require('discord.js');
const functions = require('../../utils/functions.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('guessthenumber', {
			aliases: ['guess-the-number', 'gtn'],
			category: 'games',
			channel: 'guild',
			description: 'guess the number',
			args: [
				{
					id: 'public',
					match: 'flag',
					flag: '--public'
				}
			]
		});
	}

	async exec(message, args) {
		var isPublic = false;

		if (args.public) {
			isPublic = true;
		}

		await this.client.weky.GuessTheNumber({
			message: message,
			embed: {
				title: 'Guess The Number',
				description: 'You have **{{time}}** to guess the number.',
				color: this.client.config.discord.accentColor,
				footer: 'This is just a game.',
				timestamp: true,
			},
			publicGame: isPublic,
			number: functions.randint(1, 1000),
			time: 60000,
			winMessage: {
				publicGame:
					'GG, The number I guessed was **{{number}}**. <@{{winner}}> made it in **{{time}}**.\n\n__**Stats of the game:**__\n**Duration**: {{time}}\n**Number of participants**: {{totalparticipants}} Participants\n**Participants**: {{participants}}',
				privateGame: 'GG, The number I guessed was **{{number}}**. You made it in **{{time}}**.',
			},
			loseMessage: 'Better luck next time! The number I guessed was **{{number}}**.',
			bigNumberMessage: 'No {{author}}! My number is greater than **{{number}}**.',
			smallNumberMessage: 'No {{author}}! My number is smaller than **{{number}}**.',
			othersMessage: 'Only <@{{author}}> can use the buttons!',
			buttonText: (await this.client.language('Cancel', message)),
			ongoingMessage: "A game is already running in <#{{channel}}>. You can't start a new one!",
			returnWinner: false,
		});
	}
};
