const Commando = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('withdraw', {
			aliases: ['withdraw'],
			category: 'economy',
			channel: 'guild',
			description: 'Withdraw your money from your bank account.',
			args: [
				{
					id: 'amount',
					prompt: {
						start: 'How much money would you like to withdraw?',
						retry: 'Invalid amount. Try again.'
					},
					type: 'integer'
				}
			]
		})
	}

	async exec(message, { amount }) {
		const deposit = await this.client.economy.withdraw(message.author.id, amount);

		const embed = new MessageEmbed();

		if (deposit == 'bank_limit') {
			embed.setColor('RED');
			embed.setTitle('Uh oh!');
			embed.setDescription(`Looks like the amount of money you trying to withdraw is larger than the bank limit. Try again with a lower amount.`);
		} else if (!deposit) {
			embed.setColor('RED');
			embed.setTitle('Uh oh!');
			embed.setDescription(`Looks like you don't have enough money in your bank account. Go work and get some.`);
		} else {
			embed.setColor('GREEN');
			embed.setTitle('Success!');
			embed.setDescription(`Successfully withdrew **${await this.client.economy.format(amount)}** from your bank account. Your current balance is now **${await this.client.economy.format(deposit.wallet)}**.`);
		}

		return message.reply({ embeds: [embed] });
	}
}