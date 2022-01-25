const Memer = require('random-jokes-api');
const { MessageEmbed } = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('pun', {
			aliases: ['pun'],
			category: 'fun',
			description: 'yes pun',
		});
	}

	async exec(message) {
		const meme = Memer.pun();

		const embed = new MessageEmbed().setColor('RANDOM').setDescription((await this.client.language(meme, message)));

		message.channel.send({ embeds: [embed] });
	}
};
