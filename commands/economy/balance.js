const Commando = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('balance', {
			aliases: ['balance', 'bal', '$'],
			category: 'economy',
			channel: 'guild',
			description: 'Shows your server balance or others.',
			args: [
				{
					id: 'user',
					// prompt: {
					// 	start: 'Which user would you like to see their balance?',
					// 	retry: 'That\'s an invalid one. Try again!'
					// },
					type: 'user',
					default: message => message.author,
				}
			]
		})
	}

	async exec(message, { user }) {
		var rawWallet = await this.client.economy.get(user.id, "wallet");
		var rawBank = await this.client.economy.get(user.id, "bank");

		const embed = new MessageEmbed()
			.setColor(this.client.config.discord.accentColor)
			.setTitle((await this.client.language(`${user.tag}'s Balance`, message)))
			.addFields(
				{ name: 'Wallet', value: `\`\`\`js\n${await this.client.economy.format(rawWallet)}\n\`\`\``, inline: false },
				{ name: 'Bank', value: `\`\`\`js\n${await this.client.economy.format(rawBank)}\n\`\`\``, inline: false },
			)
			.setThumbnail(user.displayAvatarURL({ dynamic: true }))
			.setTimestamp();
			
		return message.reply({ embeds: [embed] });
	}
}