const { MessageEmbed } = require('discord.js');
const Commando = require('discord-akairo');
const fetch = require('node-fetch');

module.exports = class CuddleCommand extends Commando.Command {
	constructor() {
		super('cuddle', {
			aliases: ['cuddle'],
			category: 'roleplaying',
			channel: 'guild',
			description: 'Cuddles someone.',
			args: [
				{
					id: 'user',
					type: 'user',
				},
			],
		});
	}

	async exec(message, { user }) {
		let response = await fetch('http://api.nekos.fun:8080/api/cuddle');
		let data = await response.json();

		console.log(data);

		if (user === message.author) {
			const embed = new MessageEmbed()
				.setColor('RANDOM')
				.setImage(data.image)
				.setAuthor((await this.client.language(`${message.author.username} cuddles themselves!`, message)), user.displayAvatarURL({ dynamic: true }));

			return message.channel.send({ embeds: [embed] });
		} else {
			const embed = new MessageEmbed()
				.setColor('RANDOM')
				.setImage(data.image)
				.setAuthor((await this.client.language(`${message.author.username} cuddles ${user.username}!`, message)), message.author.displayAvatarURL({ dynamic: true }));

			return message.channel.send({ embeds: [embed] });
		}
	}
};
