const canvacord = require('canvacord');
const Discord = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('jail', {
			aliases: ['jail'],
			category: 'fun',
			channel: 'guild',
			description: 'Send someone to jail.',
			args: [
				{
					id: 'user',
					type: 'member',
				},
			],
		});
	}

	async exec(message, { user }) {
		const image = await canvacord.Canvacord.jail(user.user.displayAvatarURL({ format: 'png' }));
		const attachment = new Discord.MessageAttachment(image, 'jail.png');

		const embed = new Discord.MessageEmbed()
			.setTitle(await this.client.language(`${user.user.username} is locked in jail by ${message.author.username}!`, message))
			.setImage('attachment://jail.png')
			.setColor(this.client.config.discord.accentColor)
			.setFooter((await this.client.language(`Meme created by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		message.channel.send({ embeds: [embed], files: [attachment] });
	}
};
