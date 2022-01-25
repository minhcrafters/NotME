const Discord = require('discord.js');
const functions = require('../../utils/functions.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('permissions', {
			aliases: ['permissions', 'perms'],
			category: 'util',
			channel: 'guild',
			description: "Lists a specific member's permissions of this guild.",
			args: [
				{
					id: 'user',
					type: 'member',
				},
			],
		});
	}

	async exec(message, { user }) {
		const embed = new Discord.MessageEmbed()
			.setColor(this.client.config.discord.accentColor)
			.setAuthor(message.guild.name, message.guild.iconURL())
			.setTitle((await this.client.language(`${user.user.tag}'s permissions`, message)))
			.setDescription(functions.toTitleCase(user.permissions.toArray().join('\n').replace(/_/g, ' ')).replace('Tts', 'TTS').replace('Vad', 'VAD'))
			.setFooter((await this.client.language(`Requested by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		message.channel.send({ embeds: [embed] });
	}
};
