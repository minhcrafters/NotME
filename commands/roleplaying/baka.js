const { MessageEmbed } = require('discord.js');
const Commando = require('discord-akairo');
const fetch = require('node-fetch');

module.exports = class BakaCommand extends Commando.Command {
	constructor() {
		super('baka', {
			aliases: ['baka'],
			category: 'roleplaying',
			channel: 'guild',
			description: 'Baka bakaa~',
		});
	}

	async exec(message) {
		let response = await fetch('http://api.nekos.fun:8080/api/baka');
		let data = await response.json();

		const embed = new MessageEmbed()
			.setColor(message.member.displayHexColor === '#000000' ? '#ffffff' : message.member.displayHexColor)
			.setImage(data.image)
			.setAuthor(`Baka x3.14 :P`, message.author.displayAvatarURL({ dynamic: true }));

		message.channel.send({ embeds: [embed] });
	}
};
