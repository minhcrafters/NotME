const Memer = require('random-jokes-api');
const { MessageEmbed } = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('roast', {
			aliases: ['roast'],
			category: 'fun',
			description: 'ROAST',
		});
	}

	async exec(message) {
		const meme = Memer.roast();

		const embed = new MessageEmbed().setColor('RANDOM').setDescription((await this.client.language(meme, message)));

		message.channel.send({ embeds: [embed] });
	}
};
