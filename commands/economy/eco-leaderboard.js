const Commando = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('eco-leaderboard', {
			aliases: ['eco-leaderboard', 'eco-lb'],
			category: 'economy',
			channel: 'guild',
			description: 'Displays the economy leaderboard.',
		})
	}

	async exec(message) {
		const wallet = await this.client.economy.leaderboard("wallet");
		const bank = await this.client.economy.leaderboard("bank");

		const wallets = [];
		const banks = [];

		if (wallet) {
			wallet.filter(wallet => wallet.balance.wallet !== 0).forEach(async (wallet) => {
				const user = await this.client.users.fetch(wallet.userID);
				wallets.push(`${user.tag.replace('!', '').trim()} - ${await this.client.economy.format(wallet.balance.wallet)}`);
			});
		}

		if (bank) {
			bank.filter(bank => bank.balance.bank !== 0).forEach(async (bank) => {
				const user = await this.client.users.fetch(bank.userID);
				banks.push(`${user.tag.replace('!', '').trim()} - ${await this.client.economy.format(bank.balance.bank)}`);
			});
		}

		const embed = new MessageEmbed()
			.setColor(this.client.config.discord.accentColor)
			.setDescription(
				`\`\`\`diff\n!========= [${await this.client.language(`Economy Leaderboard (Wallet)`, message)}] =========!\n${wallets.length > 0 ? wallets.join('\n') : 'No one got in the leaderboard...'}\n\`\`\``
			)
			.setTimestamp();

		const embed1 = new MessageEmbed()
			.setColor(this.client.config.discord.accentColor)
			.setDescription(
				`\`\`\`diff\n!=========== [${await this.client.language(`Economy Leaderboard (Bank)`, message)}] ===========!\n${banks.length > 0 ? banks.join('\n') : 'No one got in the leaderboard...'}\n\`\`\``
			)
			.setTimestamp();
		
		message.channel.send({ embeds: [embed, embed1] });
	}
}