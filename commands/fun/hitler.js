const canvacord = require('canvacord');
const Discord = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('hitler', {
			aliases: ['hitler'],
			category: 'fun',
			channel: 'guild',
			description: 'Worse than Hitler.',
			args: [
				{
					id: 'user',
					type: 'member',
				},
			],
		});
	}

	async exec(message, { user }) {
		const image = await canvacord.Canvacord.hitler(user.user.displayAvatarURL({ format: 'png' }));
		const attachment = new Discord.MessageAttachment(image, 'hitler.png');

		const embed = new Discord.MessageEmbed()
			.setTitle(`${user.user.username} ${await this.client.language('is worse than Hitler!', message)}`)
			.setImage('attachment://hitler.png')
			.setColor(this.client.config.discord.accentColor)
			.setFooter((await this.client.language(`Meme created by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		message.channel.send({ embeds: [embed], files: [attachment] });
	}
};
