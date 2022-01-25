const Memer = require('srod-v2');
const { MessageEmbed } = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('clyde', {
			aliases: ['clyde'],
			category: 'fun',
			description: 'Returns fake Clyde messages.',
			args: [
				{
					id: 'text',
					type: 'string',
				},
			],
		});
	}

	async exec(message, { text }) {
		var options = {
			Message: text,
			Color: this.client.config.discord.accentColor,
		};

		const data = await Memer.Clyde(options);

		const embed = new MessageEmbed()
			.setImage(data.url)
			.setDescription(`${await this.client.language('Clyde said', message)}:`)
			.setColor(this.client.config.discord.accentColor)
			.setFooter((await this.client.language(`Meme created by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		message.channel.send({ embeds: [embed] });
	}
};
