const canvacord = require('canvacord');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const Discord = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('youtube-cmt', {
			aliases: ['youtube-cmt', 'yt-cmt'],
			category: 'fun',
			channel: 'guild',
			description: 'fake youtube comments',
			args: [
				{
					id: 'user',
					type: 'member',
				},
				{
					id: 'text',
					type: 'string',
				},
			],
		});
	}

	async exec(message, { user, text }) {
		var options = {
			username: user.user.username,
			avatar: user.user.displayAvatarURL({ format: 'png', dynamic: false }).toString(),
			content: text,
			dark: false,
		};

		const data = await canvacord.Canvacord.youtube(options);

		const attachment = new MessageAttachment(data, 'youtube.png');

		const embed = new MessageEmbed().setImage('attachment://youtube.png').setColor(this.client.config.discord.accentColor).setTimestamp();

		message.channel.send({ embeds: [embed], files: [attachment] });
	}
};
