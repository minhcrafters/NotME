const { Random } = require('something-random-on-discord');
const { MessageEmbed } = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class PunchCommand extends Commando.Command {
	constructor() {
		super('punch', {
			aliases: ['punch'],
			category: 'roleplaying',
			channel: 'guild',
			description: 'Punch someone.',
			args: [
				{
					id: 'user',
					type: 'member',
				},
			],
		});
	}

	async exec(message, { user }) {
		let data = await Random.getAnimeImgURL('punch');

		console.log(data);

		if (user.user === message.author) {
			const embed = new MessageEmbed()
				.setColor(user.displayHexColor === '#000000' ? '#ffffff' : user.displayHexColor)
				.setImage(data)
				.setAuthor((await this.client.language(`${message.author.username} punches themselves! It hurts...`, message)), user.user.displayAvatarURL({ dynamic: true }));

			return message.channel.send({ embeds: [embed] });
		} else {
			const embed = new MessageEmbed()
				.setColor(user.displayHexColor === '#000000' ? '#ffffff' : user.displayHexColor)
				.setImage(data)
				.setAuthor((await this.client.language(`${message.author.username} punches ${user.user.username}! Pain...`, message)), user.user.displayAvatarURL({ dynamic: true }));

			return message.channel.send({ embeds: [embed] });
		}
	}
};
