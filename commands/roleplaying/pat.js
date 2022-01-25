const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const Commando = require('discord-akairo');

module.exports = class PatCommand extends Commando.Command {
	constructor() {
		super('pat', {
			aliases: ['pat'],
			category: 'roleplaying',
			channel: 'guild',
			description: 'Give someone a headpat.',
			args: [
				{
					id: 'user',
					type: 'member',
				},
			],
		});
	}

	async exec(message, { user }) {
		let response = await fetch('http://api.nekos.fun:8080/api/pat');
		let data = await response.json();

		console.log(data);

		if (user.user === message.author) {
			const embed = new MessageEmbed()
				.setColor(user.displayHexColor === '#000000' ? '#ffffff' : user.displayHexColor)
				.setImage(data.image)
				.setAuthor((await this.client.language(`${message.author.username} pats themselves! Hmm...`, message)), user.user.displayAvatarURL({ dynamic: true }));

			return message.channel.send({ embeds: [embed] });
		} else {
			const embed = new MessageEmbed()
				.setColor(user.displayHexColor === '#000000' ? '#ffffff' : user.displayHexColor)
				.setImage(data.image)
				.setAuthor((await this.client.language(`${message.author.username} pats ${user.user.username}! Awww!`, message)), user.user.displayAvatarURL({ dynamic: true }));

			return message.channel.send({ embeds: [embed] });
		}
	}
};
