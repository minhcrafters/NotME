const { MessageEmbed } = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('emoji2image', {
			aliases: ['emoji2image', 'e2i', 'se', 'emoji'],
			category: 'util',
			channel: 'guild',
			description: "Gets a specific **custom emoji**'s URL.",
			args: [
				{
					id: 'emoji',
					prompt: {
						start: 'Which **custom emoji** do you want to use with?'
					},
					type: 'emoji',
				},
			],
		});
	}

	async exec(message, { emoji }) {
		if (!emoji) {
			if (args[0].match(/<:.+?:\d+>/g)) {
				let emojiName = args[0].match(/:.+?:/g).toString();
				let emojiID = args[0].match(/\d+/g).toString();

				const embed = new MessageEmbed()
					.setTitle(emojiName)
					.setColor(this.client.config.discord.accentColor)
					.setDescription(`URL: [Click here](https://cdn.discordapp.com/emojis/${emojiID}.png?size=1024)`)
					.setImage(`https://cdn.discordapp.com/emojis/${emojiID}.png?size=1024`)
					.setFooter((await this.client.language(`Requested by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp();
				return message.channel.send({ embeds: [embed] });
			} else if (args[0].match(/<a:.+?:\d+>/g)) {
				let emojiName = args[0].match(/:.+?:/g).toString();
				let emojiID = args[0].match(/\d+/g).toString();

				const embed = new MessageEmbed()
					.setTitle(emojiName)
					.setColor(this.client.config.discord.accentColor)
					.setDescription(`URL: [Click here](https://cdn.discordapp.com/emojis/${emojiID}.gif?size=1024)`)
					.setImage(`https://cdn.discordapp.com/emojis/${emojiID}.gif?size=1024`)
					.setFooter((await this.client.language(`Requested by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp();

				return message.channel.send({ embeds: [embed] });
			} else {
				return message.channel.send(`${this.client.emotes.error} - Invalid emoji!`);
			}
		} else {
			const embed = new MessageEmbed()
				.setTitle(emoji.name)
				.setColor(this.client.config.discord.accentColor)
				.setDescription(`URL: [Click here](${emoji.url})`)
				.setImage(emoji.url)
				.setFooter((await this.client.language(`Requested by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
				.setTimestamp();

			return message.channel.send({ embeds: [embed] });
		}
	}
};
