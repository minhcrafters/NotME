const Discord = require('discord.js');
const fetch = require('node-fetch');
const functions = require('../../utils/functions.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('words-in-chaos', {
			aliases: ['words-in-chaos'],
			category: 'games',
			channel: 'guild',
			description: 'Guess the words inside a scrambled mess.',
		});
	}

	async exec(message) {
		const data = await fetch(`https://random-word-api.herokuapp.com/word?number=${functions.randint(3, 10)}&swear=0`);
		const json = await data.json();

		await this.client.weky.ChaosWords({
			message: message,
			embed: {
				title: 'Words-in-Chaos',
				description: 'You have **{{time}}** to find the hidden words in the below sentence.',
				color: this.client.config.discord.accentColor,
				field1: 'Sentence:',
				field2: 'Words Found/Remaining Words:',
				field3: 'Words found:',
				field4: 'Words:',
				footer: "Calm down it's just a game.",
				timestamp: true,
			},
			winMessage: 'You won! You made it in **{{time}}**.',
			loseMessage: 'Better luck next time!',
			wrongWordMessage: 'Wrong guess! You have **{{remaining_tries}}** tries left.',
			correctWordMessage: '**{{word}}** was correct! You have to find **{{remaining}}** more word(s).',
			time: 60000,
			words: json,
			charGenerated: functions.randint(10, 20),
			maxTries: 10,
			buttonText: 'Cancel',
			othersMessage: 'Only <@{{author}}> can use the buttons!',
		});
	}
};
