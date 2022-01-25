const Memer = require('srod-v2');
const Commando = require('discord-akairo');
const Discord = require('discord.js');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('trumptweet', {
			aliases: ['trumptweet'],
			category: 'fun',
			description: 'Returns fake Twitter tweet made by ex-president Donald Trump.',
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
			Tweet: text,
			Color: this.client.config.discord.accentColor,
		};

		const data = await Memer.TrumpTweet(options);

		const embed = new Discord.MessageEmbed()
			.setColor(this.client.config.discord.accentColor)
			.setFooter(`Meme created by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
			.setImage(data.embed.image.url)
			.setTimestamp();

		message.channel.send(embed);
	}
};
