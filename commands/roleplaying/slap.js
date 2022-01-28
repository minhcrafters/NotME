const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const Commando = require('discord-akairo');

module.exports = class SlapCommand extends Commando.Command {
	constructor() {
		super('slap', {
			aliases: ['slap'],
			category: 'roleplaying',
			channel: 'guild',
			description: 'Slap someone in their face.',
			args: [
				{
					id: 'user',
					type: 'member',
				},
			],
		});
	}

	async exec(message, { user }) {
		let response = await fetch('http://api.nekos.fun:8080/api/slap');
		let data = await response.json();

		console.log(data);

		if (user.user === message.author) {
			const embed = new MessageEmbed()
				.setColor(user.displayHexColor === '#000000' ? '#ffffff' : user.displayHexColor)
				.setImage(data.image)
				.setAuthor(`${message.author.username} slaps themselves in their face! It hurts...`, user.user.displayAvatarURL({ dynamic: true }));

			return message.channel.send({ embeds: [embed] });
		} else {
			const embed = new MessageEmbed()
				.setColor(user.displayHexColor === '#000000' ? '#ffffff' : user.displayHexColor)
				.setImage(data.image)
				.setAuthor((await this.client.language(`${message.author.username} slaps ${user.user.username} in their face! Ouch!`, message)), user.user.displayAvatarURL({ dynamic: true }));

			return message.channel.send({ embeds: [embed] });
		}
	}
};
