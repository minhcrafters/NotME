const canvacord = require('canvacord');
const Discord = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('triggered', {
			aliases: ['triggered'],
			category: 'fun',
			channel: 'guild',
			description: 'Triggered',
			args: [
				{
					id: 'user',
					type: 'member',
				},
			],
		});
	}

	async exec(message, { user }) {
		const avatar = user.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 });
		const image = await canvacord.Canvacord.trigger(avatar);
		const attachment = new Discord.MessageAttachment(image, 'triggered.gif');
		const embed = new Discord.MessageEmbed()
			.setImage('attachment://triggered.gif')
			.setColor(this.client.config.discord.accentColor)
			.setFooter((await this.client.language(`Meme created by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		message.channel.send({ embeds: [embed], files: [attachment] });
	}
};
