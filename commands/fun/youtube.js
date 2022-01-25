const Discord = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('youtube-together', {
			aliases: ['youtube-together', 'dailymotion', 'vimeo', 'oniontube', 'yttogether'],
			category: 'fun',
			channel: 'guild',
			description: 'Allows you to use YouTube Together with friends. Not that you have any.',
			args: [
				{
					id: 'voiceChannel',
					type: 'voiceChannel'
				}
			]
		});
	}

	async exec(message, { voiceChannel }) {
		// var channel = message.mentions.channels.first();
		// const voiceNotFound = await this.client.language("You're not connected in any voice channel!", message);
		// const invalidVoice = await this.client.language('Invalid voice channel!', message);

		// if (!channel) {
		// 	channel = message.member.voice.channel;

		// 	if (!channel) return message.channel.send(`${this.client.emotes.error} - ${voiceNotFound}`);
		// }

		// if (channel.type !== 'voice') {
		// 	return message.channel.send(`${this.client.emotes.error} - ${invalidVoice}`);
		// }

		this.client.discordTogether.createTogetherCode(voiceChannel.id, 'youtube').then(async (invite) => {
			const embed = new Discord.MessageEmbed()
				.setAuthor('YouTube Together')
				.setColor(this.client.config.discord.accentColor)
				.setTimestamp()
				.setTitle(await this.client.language('Click here to join', message))
				.setURL(invite.code);

			return message.channel.send({ embeds: [embed] });
		});
	}
};
