const canvacord = require('canvacord');
const Discord = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('fakequote', {
			aliases: ['fakequote', 'fq'],
			category: 'fun',
			channel: 'guild',
			description: 'Returns fake quotes.',
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
		const options = {
			image: user.user.displayAvatarURL({ format: 'png' }),
			username: user.user.username,
			message: text,
			color: user.displayHexColor === '#000000' ? '#ffffff' : user.displayHexColor,
		};

		const image = await canvacord.Canvacord.quote(options);
		const attachment = new Discord.MessageAttachment(image, 'fakequotes.png');

		const embed = new Discord.MessageEmbed()
			.setImage('attachment://fakequotes.png')
			.setColor(this.client.config.discord.accentColor)
			.setFooter((await this.client.language(`Meme created by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		message.channel.send({ embeds: [embed], files: [attachment] });
	}
};
