const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const Commando = require('discord-akairo');

module.exports = class HugCommand extends Commando.Command {
	constructor() {
		super('hug', {
			aliases: ['hug'],
			category: 'roleplaying',
			channel: 'guild',
			description: 'Give someone a hug.',
			args: [
				{
					id: 'user',
					type: 'user',
				},
			],
		});
	}

	async exec(message, { user }) {
		let response = await fetch('http://api.nekos.fun:8080/api/hug');
		let data = await response.json();

		if (user === message.author) {
			return message.inlineReply(`${this.client.emotes.error} - ${await this.client.language("You can't hug yourself!", message)}`);
		}

		const embed = new MessageEmbed()
			.setColor('RANDOM')
			.setImage(data.image)
			.setAuthor((await this.client.language(`${message.author.username} hugs ${user.username}! Yay...`, message)), user.displayAvatarURL({ dynamic: true }));

		message.channel.send({ embeds: [embed] });
	}
};
