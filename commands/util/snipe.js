const { MessageEmbed } = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class SnipeCommand extends Commando.Command {
	constructor() {
		super('snipe', {
			aliases: ['snipe'],
			category: 'util',
			channel: 'guild',
			description: 'Sees the most recent deleted or edited message.',
			userPermissions: ['MANAGE_MESSAGES'],
		});
	}

	async exec(message) {
		const msg = this.client.snipes.get(message.channel.id);

		const embed = new MessageEmbed()
			.setColor(this.client.config.discord.accentColor)
			.setAuthor(msg.author, msg.member.user.displayAvatarURL())
			.setDescription(msg.content)
			.setFooter('Get sniped lol')
			.setTimestamp();

		return message.channel.send({ embeds: [embed] });
	}
};
