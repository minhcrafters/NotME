const { MessageEmbed } = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('avatar', {
			aliases: ['avatar', 'av'],
			category: 'util',
			channel: 'guild',
			description: "Shows a user's avatar with a specified size (Default is 4096).",
			args: [
				{
					id: 'user',
					type: 'relevant',
					default: message => message.author,
				},
				{
					id: 'size',
					prompt: {
						start: 'What size?',
						optional: true
					},
					type: 'integer',
					default: 4096,
				},
			],
		});
	}

	async exec(message, { user, size }) {
		/*
        const embed = new MessageEmbed()
            .setTitle(user.nickname)
            .setImage(user.user.displayAvatarURL({
                dynamic: true,
                format: format,
                size: size
            }))
            .setDescription('Actual image may larger or smaller than this image.')
            .setTimestamp()
            .setFooter(`Image Format: ${format.toUpperCase()}, Image Size: ${size}`);
        */

		const embed = new MessageEmbed()
			.setTitle((await this.client.language(`${user.username}'s Avatar`, message)))
			.setColor(this.client.config.discord.accentColor)
			.setDescription([
				`**${await this.client.language('Image Size:', message)}** ${size}`,
				`**URL:** [${await this.client.language('Click here', message)}](${user.avatarURL({ dynamic: true, size: size })})`
				].join('\r\n'))
			.setImage(
				user.displayAvatarURL({
					dynamic: true,
					size: size,
				})
			)
			.setFooter((await this.client.language(`Requested by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		return message.channel.send({ embeds: [embed] });
	}
};
