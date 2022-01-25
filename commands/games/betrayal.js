const Discord = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Amogus extends Commando.Command {
	constructor() {
		super('betryal', {
			aliases: ['betrayal', 'amogusripoff'],
			category: 'games',
			channel: 'guild',
			description: 'tf is this',
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

		this.client.discordTogether.createTogetherCode(voiceChannel.id, 'betrayal').then(async (invite) => {
			const embed = new Discord.MessageEmbed().setAuthor('Betrayal.io').setColor(this.client.config.discord.accentColor).setTimestamp().setTitle((await this.client.language('Click here to join', message))).setURL(invite.code);

			return message.channel.send({ embeds: [embed] });
		});
	}
};
