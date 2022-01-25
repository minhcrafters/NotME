const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const Commando = require('discord-akairo');

module.exports = class SmugCommand extends Commando.Command {
	constructor() {
		super('smug', {
			aliases: ['smug'],
			category: 'roleplaying',
			channel: 'guild',
			description: 'What to put here?',
		});
	}

	async exec(message) {
		let response = await fetch('http://api.nekos.fun:8080/api/smug');
		let data = await response.json();

		console.log(data);

		const embed = new MessageEmbed()
			.setColor(message.member.displayHexColor === '#000000' ? '#ffffff' : message.member.displayHexColor)
			.setImage(data.image)
			.setAuthor((await this.client.language(`${message.author.username} is smugging!`, message)), message.author.displayAvatarURL({ dynamic: true }));

		return message.channel.send({ embeds: [embed] });
	}
};
