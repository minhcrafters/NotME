const canvacord = require('canvacord');
const Discord = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('rip', {
			aliases: ['rip'],
			category: 'fun',
			channel: 'guild',
			description: 'F in the chat',
			args: [
				{
					id: 'user',
					type: 'member',
					default: message => message.member,
				},
			],
		});
	}

	async exec(message, { user }) {
		const image = await canvacord.Canvacord.rip(user.user.displayAvatarURL({ format: 'png' }));
		const attachment = new Discord.MessageAttachment(image, 'rip.png');

		const embed = new Discord.MessageEmbed()
			.setTitle('F in the chat')
			.setImage('attachment://rip.png')
			.setColor(this.client.config.discord.accentColor)
			.setFooter((await this.client.language(`Meme created by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		message.channel.send({ embeds: [embed], files: [attachment] });
	}
};
