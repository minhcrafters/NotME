const Commando = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('rob', {
			aliases: ['rob', 'steal'],
			category: 'economy',
			channel: 'guild',
			description: 'Robs someone in the server.',
			args: [
				{
					id: 'user',
					type: 'member'
				}
			]
		})
	}

	async exec(message, { user }) {
		const robbed = await this.client.economy.rob(message.author.id, user.user.id, 10, 500, this.client.functions.randint(0, 20));

		if (!robbed) {
			return message.inlineReply('Well, you failed... Try again next time!');
		}

		const embed = new MessageEmbed();
		
		embed.setColor('GREEN')
		embed.setTitle('Success!')
		embed.setDescription(`Successfully stole **${await this.client.economy.format(robbed.earned)}** from **${user.user.tag}**. Your current balance is now **${await this.client.economy.format(robbed.wallet)}**.`)

		return message.reply({ embeds: [embed] });
	}
}