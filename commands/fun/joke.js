const Random = require('srod-v2');
const { MessageEmbed } = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('joke', {
			aliases: ['joke'],
			category: 'fun',
			description: 'Jokes.',
		});
	}

	async exec(message) {
		let data = await Random.GetJoke();

		const embed = new MessageEmbed().setTitle((await this.client.language(data.embed.title, message))).setDescription(await this.client.language(data.embed.description, message)).setColor(data.embed.color);

		message.channel.send({ embeds: [embed] });
	}
};
