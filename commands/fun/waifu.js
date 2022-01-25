const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('waifu', {
			aliases: ['waifu'],
			category: 'fun',
			channel: 'guild',
			description: 'Get a random waifu image.',
		});
	}

	async exec(message) {
		let response = await fetch('http://api.nekos.fun:8080/api/waifu');
		let data = await response.json();

		console.log(data);

		const embed = new MessageEmbed()
			.setColor(message.author.displayHexColor === '#000000' ? '#ffffff' : message.author.displayHexColor)
			.setImage(data.image)
			.setAuthor((await this.client.language('Your waifu is here!', message)), message.author.displayAvatarURL({ dynamic: true }));

		message.channel.send(embed);
	}
};
