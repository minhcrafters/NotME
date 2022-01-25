const Commando = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('daily', {
			aliases: ['daily', 'timely'],
			category: 'economy',
			channel: 'guild',
			description: 'Get daily reward.'
		})
	}

	async exec(message) {
		const daily = await this.client.economy.daily(message.author.id, '20');

		const embed = new MessageEmbed();

		if (!daily) {
			const timeout = await this.client.economy.getTimeout(message.author.id, 'daily');
			embed.setColor('RED');
			embed.setTitle('Uh oh!');
			embed.setDescription(`Looks like you claimed too early. Try again <t:${moment.unix(Number(timeout) / 1000).add(1, 'day').unix()}:R>.`);
		} else {
			embed.setColor('GREEN')
			embed.setTitle('Success!')
			embed.setDescription(`Successfully claimed **$20** as a daily reward. Your current balance is now **${await this.client.economy.format(daily.wallet)}**.`)
		}

		message.reply({ embeds: [embed] });
	}
}