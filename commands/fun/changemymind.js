const canvacord = require('canvacord');
const Discord = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class ChangeMyMind extends Commando.Command {
	constructor() {
		super('changemymind', {
			aliases: ['changemymind'],
			category: 'fun',
			description: 'Change my mind.',
			args: [
				{
					id: 'text',
					type: 'string',
				},
			],
		});
	}

	async exec(message, { text }) {
		const image = await canvacord.Canvacord.changemymind(text || 'Life is pain');
		const attachment = new Discord.MessageAttachment(image, 'changemymind.png');

		const embed = new Discord.MessageEmbed()
			.setImage('attachment://changemymind.png')
			.setColor(this.client.config.discord.accentColor)
			.setFooter((await this.client.language(`Meme created by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		message.channel.send({ embeds: [embed], files: [attachment] });
	}
};
