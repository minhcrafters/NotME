const Discord = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('guessthepokemon', {
			aliases: ['guess-the-pokemon', 'pokemon-guess', 'gtp'],
			category: 'games',
			channel: 'guild',
			description: "Guess the Pokémon based on it's type and abilities.",
		});
	}

	async exec(message) {
		await this.client.weky.GuessThePokemon({
			message: message,
			embed: {
				title: (await this.client.language('Guess The Pokémon', message)),
				description: '**Type:**\n{{type}}\n\n**Abilities:**\n{{abilities}}\n\nYou only have **{{time}}** to guess the pokémon.',
				color: '#5865F2',
				footer: 'pokémon les go',
				timestamp: true,
			},
			thinkMessage: (await this.client.language("I'm thinking", message)),
			othersMessage: 'Only <@{{author}}> can use the buttons!',
			winMessage: 'It was a **{{answer}}**! You got it correct in **{{time}}**.',
			loseMessage: 'Better luck next time! It was a **{{answer}}**.',
			time: 60000,
			incorrectMessage: "No, {{author}}! The pokémon isn't `{{answer}}`.",
			buttonText: (await this.client.language("Cancel", message)),
		});
	}
};
