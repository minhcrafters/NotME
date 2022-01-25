const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class CryCommand extends Commando.Command {
	constructor() {
		super('cry', {
			aliases: ['cry'],
			category: 'roleplaying',
			channel: 'guild',
			description: 'just cry',
		});
	}

	async exec(message) {
		let response = await fetch('http://api.nekos.fun:8080/api/cry');
		let data = await response.json();

		console.log(data);

		const embed = new MessageEmbed()
			.setColor(message.member.displayHexColor === '#000000' ? '#ffffff' : message.member.displayHexColor)
			.setImage(data.image)
			.setAuthor(`${message.author.username} is crying!`, message.author.displayAvatarURL({ dynamic: true }));

		message.channel.send({ embeds: [embed] });
	}
};
