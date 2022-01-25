const Commando = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('work', {
			aliases: ['work'],
			category: 'economy',
			channel: 'guild',
			description: 'Works to get money.',
		})
	}

	async exec(message) {
		const { earned, balance } = await this.client.economy.work(message.author.id, 50, 100);

		return message.reply(`You worked as a... well.. normal worker and earned **${await this.client.economy.format(earned)}**. Your current balance is now **${await this.client.economy.format(balance.wallet)}**.`);
	}
}