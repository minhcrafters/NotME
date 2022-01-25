const Random = require('srod-v2');
const { MessageEmbed } = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('why', {
			aliases: ['why'],
			category: 'fun',
			description: 'Why?',
		});
	}

	async exec(message) {
		let data = await Random.GetWhy({
			Color: 'RANDOM',
		});

		const embed = new MessageEmbed().setDescription((await this.client.language(data.embed.description, message))).setColor(data.embed.color);

		message.channel.send({ embeds: [embed] });
	}
};
