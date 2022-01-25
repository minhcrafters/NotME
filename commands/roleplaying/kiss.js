const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('kiss', {
			aliases: ['kiss'],
			category: 'roleplaying',
			channel: 'guild',
			description: 'Kiss someone virtually.',
			args: [
				{
					id: 'user',
					type: 'user',
				},
			],
		});
	}

	async run(message, { user }) {
		let response = await fetch('http://api.nekos.fun:8080/api/kiss');
		let data = await response.json();

		console.log(data);

		if (user === message.author) {
			return message.channel.send(`${this.client.emotes.error} - ${await this.client.language("You can't kiss yourself!", message)}`);
		}

		const embed = new MessageEmbed()
			.setColor('RANDOM')
			.setImage(data.image)
			.setAuthor((await this.client.language(`${message.author.username} kisses ${user.username}! So sweet...`, message)), user.displayAvatarURL({ dynamic: true }));

		message.channel.send({ embeds: [embed] });
	}
};
