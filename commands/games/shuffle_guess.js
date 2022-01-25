const Discord = require('discord.js');
const fetch = require('node-fetch');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('shuffleguess', {
			aliases: ['shuffle-guess'],
			category: 'games',
			channel: 'guild',
			description: 'Guess a shuffled word.',
		});
	}

	async exec(message) {
		const data = await fetch('https://random-word-api.herokuapp.com/word?number=1&swear=0');
		const json = await data.json();

		await this.client.weky.ShuffleGuess({
			message: message,
			embed: {
				title: 'Shuffle Guess',
				color: this.client.config.discord.accentColor,
				footer: 'This is just a game.',
				timestamp: true
			},
			word: json,
			button: { cancel: 'Cancel', reshuffle: 'Reshuffle' },
			startMessage:
				'I shuffled a word, it\'s **`{{word}}`**. You have **{{time}}** to find the correct word!',
			winMessage:
				'It was **{{word}}**! You gave the correct answer in **{{time}}.**',
			loseMessage: 'Better luck next time! The correct answer was **{{answer}}**.',
			incorrectMessage: "No {{author}}! The word isn't `{{answer}}`",
			othersMessage: 'Only <@{{author}}> can use the buttons!',
			time: 60000
		});
	}
};
