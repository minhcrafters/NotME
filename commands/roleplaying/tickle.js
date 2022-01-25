const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const Commando = require('discord-akairo');

module.exports = class TickleCommand extends Commando.Command {
	constructor() {
		super('tickle', {
			aliases: ['tickle'],
			category: 'roleplaying',
			channel: 'guild',
			description: ';)',
			args: [
				{
					id: 'user',
					type: 'member',
				},
			],
		});
	}

	async exec(message, { user }) {
		let response = await fetch('http://api.nekos.fun:8080/api/tickle');
		let data = await response.json();

		console.log(data);

		if (user.user === message.author) {
			const embed = new MessageEmbed()
				.setColor(user.displayHexColor === '#000000' ? '#ffffff' : user.displayHexColor)
				.setImage(data.image)
				.setAuthor((await this.client.language(`${message.author.username} tickles themselves!`, message)), user.user.displayAvatarURL({ dynamic: true }));

			return message.channel.send({ embeds: [embed] });
		} else {
			const embed = new MessageEmbed()
				.setColor(message.author.displayHexColor === '#000000' ? '#ffffff' : message.author.displayHexColor)
				.setImage(data.image)
				.setAuthor((await this.client.language(`${message.author.username} tickles ${user.user.username}!`, message)), message.author.displayAvatarURL({ dynamic: true }));

			return message.channel.send({ embeds: [embed] });
		}
	}
};
