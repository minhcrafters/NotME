const fetch = require('node-fetch');
const Discord = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('quotes', {
			aliases: ['quotes', 'quote'],
			category: 'info',
			description: 'Get random quotes.',
		});
	}

	async exec(message) {
		let data = await fetch('https://zenquotes.io/api/random');
		let response = await data.json();

		const embed = new Discord.MessageEmbed()
			.setTimestamp()
			.setColor(this.client.config.discord.accentColor)
			.setDescription((await this.client.language(`"${response[0]['q']}"`, message)))
			.setFooter((await this.client.language(`A random quote by "${response[0]['a']}"`, message)));

		message.channel.send({ embeds: [embed] });
	}
};
