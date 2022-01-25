const canvacord = require('canvacord');
const Discord = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('wanted', {
			aliases: ['wanted'],
			category: 'fun',
			channel: 'guild',
			description: 'Wanted.',
			args: [
				{
					id: 'user',
					type: 'member',
				},
			],
		});
	}

	async exec(message, { user }) {
		const image = await canvacord.Canvacord.wanted(user.user.displayAvatarURL({ format: 'png' }));
		const attachment = new Discord.MessageAttachment(image, 'wanted.png');

		const embed = new Discord.MessageEmbed()
			.setImage('attachment://wanted.png')
			.setColor(this.client.config.discord.accentColor)
			.setFooter((await this.client.language(`Meme created by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		message.channel.send({ embeds: [embed], files: [attachment] });
	}
};
