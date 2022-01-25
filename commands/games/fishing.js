const Discord = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('fishington', {
			aliases: ['fishington'],
			category: 'games',
			channel: 'guild',
			description: 'fishy fishy',
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

		// if (!channel) {
		// 	channel = message.member.voice.channel;

		// 	if (!channel) return message.channel.send(`${this.client.emotes.error} - ${await this.client.language("You're not connected in any voice channel!", message)}`);
		// }

		// if (channel.type !== 'voice') {
		// 	return message.channel.send(`${this.client.emotes.error} - ${await this.client.language('Invalid voice channel!', message)}`);
		// }

		this.client.discordTogether.createTogetherCode(voiceChannel.id, 'fishing').then(async (invite) => {
			const embed = new Discord.MessageEmbed().setAuthor('Fishington.io').setColor(this.client.config.discord.accentColor).setTimestamp().setTitle((await this.client.language('Click here to join', message))).setURL(invite.code);

			return message.channel.send({ embeds: [embed] });
		});
	}
};
