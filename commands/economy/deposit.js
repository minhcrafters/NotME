const Commando = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('deposit', {
			aliases: ['deposit'],
			category: 'economy',
			channel: 'guild',
			description: 'Deposits your money in your wallet to your bank account.',
			args: [
				{
					id: 'amount',
					prompt: {
						start: 'How much money would you like to deposit?',
						retry: 'That\'s an invalid number, try again.'
					},
					type: 'integer'
				}
			]
		})
	}

	async exec(message, { amount }) {
		const deposit = await this.client.economy.deposit(message.author.id, amount);

		const embed = new MessageEmbed();

		if (deposit == 'bank_limit') {
			embed.setColor('RED');
			embed.setTitle('Uh oh!');
			embed.setDescription(`Looks like the amount of money you trying to deposit is larger than the bank limit. Try again with a lower amount.`);
		} else if (!deposit) {
			embed.setColor('RED');
			embed.setTitle('Uh oh!');
			embed.setDescription(`Looks like you don't have enough money in your wallet. Go work and get some.`);
		} else {
			embed.setColor('GREEN');
			embed.setTitle('Success!');
			embed.setDescription(`Successfully deposited **${this.client.economy.format(amount)}** to your bank account. Your current balance is now **${this.client.economy.format(deposit.wallet)}**.`);
		}

		return message.reply({ embeds: [embed] });
	}
}