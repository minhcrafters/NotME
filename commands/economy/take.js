const Commando = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('take', {
			aliases: ['take', 'untransfer'],
			category: 'economy',
			channel: 'guild',
			description: 'Take money from someone else.',
			args: [
				{
					id: 'user',
					type: 'member'
				},
				{
					id: 'amount',
					prompt: {
						start: 'How much money would you like to give to?',
						retry: 'Invalid amount. Try again.'
					},
					type: 'integer'
				},
			],
			userPermissions: ['ADMINISTRATOR']
		})
	}

	async exec(message, args) {
		const transferTarget = args.user.user;
		const currentAmount = await this.client.economy.get(transferTarget.id, "bank");
		const transferAmount = args.amount;

		const embed = new MessageEmbed();

		if (!transferAmount || isNaN(transferAmount)) {
			embed.setColor('RED');
			embed.setTitle('Uh oh!');
			embed.setDescription(`That's an invalid amount. Check your number and see if it's a number.`);

			return message.reply({ embeds: [embed] })
		}

		if (transferAmount <= 0) {
			embed.setColor('RED');
			embed.setTitle('Uh oh!');
			embed.setDescription(`Have you studied positive numbers yet?`);

			return message.reply({ embeds: [embed] })
		}
		
		if (transferAmount > currentAmount) {
			embed.setColor('RED');
			embed.setTitle('Uh oh!');
			embed.setDescription(`They'll go bankrupt when you take that amount of money. Try again with a lower amount.`);

			return message.reply({ embeds: [embed] })
		}

		const given = await this.client.economy.take(transferTarget.id, transferAmount, "bank");

		if (given == 'bank_limit') {
			embed.setColor('RED');
			embed.setTitle('Uh oh!');
			embed.setDescription(`Looks like the amount of money you trying to take is larger than the bank limit. Try again with a lower amount.`);

			return message.reply({ embeds: [embed] })
		} else {
			embed.setColor('GREEN')
			embed.setTitle('Success!')
			embed.setDescription(`Successfully took **${await this.client.economy.format(transferAmount)}** from **${transferTarget.tag}**. Their current bank balance is now **${await this.client.economy.format(given.bank)}**.`)

			return message.reply({ embeds: [embed] })
		}
	}
}