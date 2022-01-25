const Random = require('srod-v2');
const { MessageEmbed } = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class AdviceCommand extends Commando.Command {
	constructor() {
		super('advice', {
			aliases: ['advice'],
			category: 'fun',
			description: 'Get a random advice.',
		});
	}

	async exec(message) {
		let data = await Random.GetAdvice();

		const embed = new MessageEmbed().setDescription((await this.client.language(data.embed.description, message))).setColor(data.embed.color);

		message.channel.send({ embeds: [embed] });
	}
};
