const Discord = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('fasttyper', {
			aliases: ['fast-type', 'fast-typer'],
			category: 'games',
			channel: 'guild',
			description: 'typing goes brrr',
		});
	}

	async exec(message) {
		var verbs, nouns, adjectives, adverbs, preposition;

		nouns = ['bird', 'clock', 'boy', 'plastic', 'duck', 'teacher', 'old lady', 'professor', 'hamster', 'dog'];
		verbs = ['kicked', 'ran', 'flew', 'dodged', 'sliced', 'rolled', 'died', 'breathed', 'slept', 'killed'];
		adjectives = ['beautiful', 'lazy', 'professional', 'lovely', 'dumb', 'rough', 'soft', 'hot', 'vibrating', 'slimy'];
		adverbs = ['slowly', 'elegantly', 'precisely', 'quickly', 'sadly', 'humbly', 'proudly', 'shockingly', 'calmly', 'passionately'];
		preposition = ['down', 'into', 'up', 'on', 'upon', 'below', 'above', 'through', 'across', 'towards'];

		// function randGen() {
		// 	return Math.floor(Math.random() * 5);
		// }

		function sentence() {
			var rand1 = Math.floor(Math.random() * 10);
			var rand2 = Math.floor(Math.random() * 10);
			var rand3 = Math.floor(Math.random() * 10);
			var rand4 = Math.floor(Math.random() * 10);
			var rand5 = Math.floor(Math.random() * 10);
			var rand6 = Math.floor(Math.random() * 10);

			// var randCol = [rand1, rand2, rand3, rand4, rand5];
			// var i = randGen();

			var content =
				'The ' +
				adjectives[rand1] +
				' ' +
				nouns[rand2] +
				' ' +
				adverbs[rand3] +
				' ' +
				verbs[rand4] +
				' because some ' +
				nouns[rand1] +
				' ' +
				adverbs[rand1] +
				' ' +
				verbs[rand1] +
				' ' +
				preposition[rand1] +
				' a ' +
				adjectives[rand2] +
				' ' +
				nouns[rand5] +
				' which, became a ' +
				adjectives[rand3] +
				', ' +
				adjectives[rand4] +
				' ' +
				nouns[rand6];

			return content;
		}

		await this.client.weky.FastType({
			message: message,
			embed: {
				title: 'FastTyper',
				description: 'You have **{{time}}** to type the below sentence.',
				color: this.client.config.discord.accentColor,
				footer: 'This is just a game.',
				timestamp: true,
			},
			sentence: sentence(),
			winMessage: 'You made it in **{{time}}**.\nYou have a WPM (Words per Minute) of **{{wpm}}**.',
			loseMessage: await this.client.language('Better luck next time!', message),
			cancelMessage: await this.client.language('You ended the game!', message),
			time: 120000,
			buttonText: await this.client.language('Cancel', message),
			othersMessage: 'Only <@{{author}}> can use the buttons!',
		});
	}
};
